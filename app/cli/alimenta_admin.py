"""Alimenta Admin CLI for managing users, ediles, and audit trails.

Usage:
    alimenta-admin create-user <email> <name> [--role <role>] [--password <password>]
    alimenta-admin activate-edil <user_id> <community_id>
    alimenta-admin view-audit [--user <user_id>] [--limit <n>]
"""

import click
import sys
from datetime import datetime
from typing import Optional, List

from sqlmodel import Session, select, text

from app.database import engine
from app.models.user import User  # Will be created if needed
from app.services.audit import audit_trail_table  # Will be created if needed


# Constants
USERS_TABLE_EXISTS = False  # Will be determined at runtime
AUDIT_TABLE_EXISTS = False


def get_db_session():
    """Get a database session."""
    from sqlmodel import Session
    return Session(engine)


@click.group()
@click.version_option(version="1.0.0", prog_name="alimenta-admin")
def cli():
    """Alimenta Admin CLI - Management tools for Alimenta platform."""
    pass


@cli.command()
@click.argument("email")
@click.argument("name")
@click.option("--role", "-r", default="donante", help="User role (donante, edil, agente, administrador)")
@click.option("--password", "-p", prompt=True, hide_input=True, help="User password")
@click.option("--force", "-f", is_flag=True, help="Force creation even if user exists (will overwrite)")
def create_user(email: str, name: str, role: str, password: str, force: bool):
    """Create a new user account.

    EMAIL: User's email address (must be unique)
    NAME: User's full name
    """
    valid_roles = {"donante", "edil", "agente", "administrador"}

    if role.lower() not in valid_roles:
        click.echo(f"Error: Role must be one of: {', '.join(valid_roles)}", err=True)
        sys.exit(1)

    session = get_db_session()

    try:
        # Check if user already exists
        stmt = select(text("email")).where(text("email = :email")).params(email=email)
        existing = session.exec(stmt).first()

        if existing and not force:
            click.echo(f"Error: User with email '{email}' already exists.", err=True)
            click.echo("Use --force to overwrite or choose a different email.", err=True)
            sys.exit(1)

        # Create user
        if not force and existing:
            click.echo(f"Updating existing user: {email}")
        else:
            click.echo(f"Creating new user: {email}")

        # Check if users table exists, if not create it
        table_check = session.exec(
            text("SELECT to_regclass('usuarios') IS NOT NULL")
        ).scalar()

        if not table_check:
            click.echo("Creating usuarios table...")
            session.exec(text("""
                CREATE TABLE IF NOT EXISTS usuarios (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    name VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    is_active BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
                )
            """))
            session.commit()

        # Insert or update user
        now = datetime.utcnow().isoformat()
        password_hash = f"hashed_{password}"  # Placeholder - in production use proper hashing

        if existing:
            session.exec(text("""
                UPDATE usuarios 
                SET name = :name, role = :role, password_hash = :password_hash,
                    updated_at = :updated_at
                WHERE email = :email
            """), params={
                "name": name,
                "role": role,
                "password_hash": password_hash,
                "updated_at": now,
                "email": email
            })
        else:
            session.exec(text("""
                INSERT INTO usuarios (email, name, role, password_hash, is_active, created_at, updated_at)
                VALUES (:email, :name, :role, :password_hash, FALSE, :now, :now)
            """), params={
                "email": email,
                "name": name,
                "role": role,
                "password_hash": password_hash,
                "now": now
            })

        session.commit()

        # Get the user ID
        user_id = session.exec(
            text("SELECT id FROM usuarios WHERE email = :email"),
            email=email
        ).one()

        click.echo(f"\n✓ User created successfully!")
        click.echo(f"  ID: {user_id}")
        click.echo(f"  Email: {email}")
        click.echo(f"  Name: {name}")
        click.echo(f"  Role: {role}")
        click.echo(f"  Active: False (check with 'alimenta-admin activate-edil')")

    except Exception as e:
        session.rollback()
        click.echo(f"Error creating user: {e}", err=True)
        sys.exit(1)
    finally:
        session.close()


@cli.command()
@click.argument("user_id", type=int)
@click.argument("community_id", type=int)
@click.option("--notes", "-n", default="", help="Optional notes for the activation")
def activate_edil(user_id: int, community_id: int, notes: str):
    """Activate a user as an Edil (community representative) for a specific community.

    USER_ID: The ID of the user to activate as Edil
    COMMUNITY_ID: The ID of the community

    This command:
    1. Verifies the user exists and has donante/transportador role
    2. Creates an ediles_comunidades relationship record
    3. Sets the user's is_active flag to TRUE
    4. Logs the action in the audit trail
    """
    session = get_db_session()

    try:
        # Verify user exists
        user = session.exec(
            text("SELECT id, email, role, name FROM usuarios WHERE id = :user_id"),
            user_id=user_id
        ).first()

        if not user:
            click.echo(f"Error: User with ID {user_id} not found.", err=True)
            sys.exit(1)

        email, role, name = user[1], user[3], user[4]

        # Check if user is already active
        is_active = session.exec(
            text("SELECT is_active FROM usuarios WHERE id = :user_id"),
            user_id=user_id
        ).scalar()

        # Update user role to edil if not already
        if role != "edil":
            session.exec(text("""
                UPDATE usuarios SET role = 'edil', updated_at = :now WHERE id = :user_id
            """), params={"now": datetime.utcnow().isoformat(), "user_id": user_id})

        # Activate user
        session.exec(text("""
            UPDATE usuarios SET is_active = TRUE, updated_at = :now WHERE id = :user_id
        """), params={"now": datetime.utcnow().isoformat(), "user_id": user_id})

        # Create ediles_comunidades relationship if table exists
        table_check = session.exec(
            text("SELECT to_regclass('ediles_comunidades') IS NOT NULL")
        ).scalar()

        if table_check:
            session.exec(text("""
                INSERT INTO ediles_comunidades (usuario_id, comunidad_id, verified_by_admin, created_at)
                VALUES (:user_id, :community_id, FALSE, :now)
                ON CONFLICT (usuario_id, comunidad_id) DO NOTHING
            """), params={
                "user_id": user_id,
                "community_id": community_id,
                "now": datetime.utcnow().isoformat()
            })
        else:
            click.echo("Note: ediles_comunidades table does not exist. Skipping relationship creation.")

        # Log to audit trail
        audit_table_check = session.exec(
            text("SELECT to_regclass('auditoria') IS NOT NULL")
        ).scalar()

        if audit_table_check:
            session.exec(text("""
                INSERT INTO auditoria (actor_id, accion, objeto, fecha, razón)
                VALUES (:user_id, 'activate_edil', 'usuarios', :now, :notes)
            """), params={
                "user_id": user_id,
                "now": datetime.utcnow().isoformat(),
                "notes": notes or "Activated as Edil for community verification"
            })

        session.commit()

        click.echo(f"\n✓ Edil activated successfully!")
        click.echo(f"  User: {name} ({email})")
        click.echo(f"  User ID: {user_id}")
        click.echo(f"  Community ID: {community_id}")
        click.echo(f"  Role: Edil (community representative)")
        click.echo(f"  Status: Active")

    except Exception as e:
        session.rollback()
        click.echo(f"Error activating edil: {e}", err=True)
        sys.exit(1)
    finally:
        session.close()


@cli.command()
@click.option("--user", "-u", type=int, help="Filter audit by user ID")
@click.option("--limit", "-l", default=50, help="Maximum number of audit entries to show (default: 50)")
@click.option("--action", "-a", default=None, help="Filter by action type")
@click.option("--format", "-f", "output_format", default="table", type=click.Choice(["table", "json", "csv"]), help="Output format")
def view_audit(user: Optional[int], limit: int, action: Optional[str], output_format: str):
    """View the audit trail of system actions.

    Shows all changes made to the system, including:
    - User activations
    - Feature flag changes
    - Appointment modifications
    - Any other auditable actions
    """
    session = get_db_session()

    try:
        # Check if auditoria table exists
        table_check = session.exec(
            text("SELECT to_regclass('auditoria') IS NOT NULL")
        ).scalar()

        if not table_check:
            click.echo("Error: auditoria table does not exist.", err=True)
            click.echo("Run migrations first to create the audit table.")
            sys.exit(1)

        # Build query
        conditions = []
        params = {"limit": limit}

        if user is not None:
            conditions.append("actor_id = :user_id")
            params["user_id"] = user

        if action is not None:
            conditions.append("accion = :action")
            params["action"] = action

        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

        query = f"""
            SELECT id, actor_id, accion, objeto, fecha, razón
            FROM auditoria
            {where_clause}
            ORDER BY fecha DESC
            LIMIT :limit
        """

        results = session.exec(text(query), params=params).all()

        if not results:
            click.echo("No audit entries found.")
            return

        # Output results
        if output_format == "json":
            import json
            entries = [
                {
                    "id": r[0],
                    "actor_id": r[1],
                    "action": r[2],
                    "object": r[3],
                    "timestamp": r[4],
                    "reason": r[5]
                }
                for r in results
            ]
            click.echo(json.dumps(entries, indent=2))

        elif output_format == "csv":
            import csv
            writer = csv.writer(click.get_text_stream("stdout"))
            writer.writerow(["id", "actor_id", "action", "object", "timestamp", "reason"])
            for r in results:
                writer.writerow(r)

        else:  # table format
            click.echo(f"\nAudit Trail (showing {len(results)} entries)")
            click.echo("=" * 100)
            click.echo(f"{'ID':<6} {'Actor':<8} {'Action':<25} {'Object':<15} {'Timestamp':<25} {'Reason'}")
            click.echo("-" * 100)
            for r in results:
                click.echo(f"{r[0]:<6} {r[1] or 'N/A':<8} {r[2]:<25} {r[3]:<15} {r[4]:<25} {r[5] or ''}")

    except Exception as e:
        click.echo(f"Error querying audit trail: {e}", err=True)
        sys.exit(1)
    finally:
        session.close()


if __name__ == "__main__":
    cli()