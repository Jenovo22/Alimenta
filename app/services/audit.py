"""Audit trail models and utilities for the Alimenta platform."""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


# Table definition for audit (created at runtime, not as a model class)
audit_trail_table = None  # Table will be created via migrations


class AuditBase(SQLModel):
    """Base schema for audit records."""

    actor_id: Optional[int] = Field(foreign_key="usuarios.id", default=None)
    accion: str = Field(max_length=100, description="Action type/verb")
    objeto: str = Field(max_length=100, description="Target object")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    razón: Optional[str] = Field(default=None, max_length=500, description="Reason/context")


def log_audit_action(
    session,
    actor_id: Optional[int],
    action: str,
    obj: str,
    reason: Optional[str] = None
) -> None:
    """Log an action to the audit trail.

    Args:
        session: Database session
        actor_id: ID of the user performing the action
        action: Action type (e.g., 'create', 'update', 'delete', 'activate')
        obj: Target object (e.g., 'usuarios', 'appointments')
        reason: Optional reason/context for the action
    """
    from sqlmodel import text

    now = datetime.utcnow().isoformat()

    session.exec(text("""
        INSERT INTO auditoria (actor_id, accion, objeto, fecha, razón)
        VALUES (:actor_id, :accion, :objeto, :fecha, :razon)
    """), params={
        "actor_id": actor_id,
        "accion": action,
        "objeto": obj,
        "fecha": now,
        "razon": reason
    })

    session.commit()


# Alembic migration for audit table
def get_audit_migration():
    """Return Alembic migration for auditoria table."""
    return """
    def upgrade():
        op.create_table('auditoria',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('actor_id', sa.Integer(), nullable=True),
            sa.Column('accion', sa.VARCHAR(length=100), nullable=False),
            sa.Column('objeto', sa.VARCHAR(length=100), nullable=False),
            sa.Column('fecha', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
            sa.Column('razón', sa.VARCHAR(length=500), nullable=True),
            sa.ForeignKeyConstraint(['actor_id'], ['usuarios.id'], ondelete='SET NULL'),
            sa.PrimaryKeyConstraint('id'),
        )
        op.create_index(op.f('ix_auditoria_fecha'), 'auditoria', ['fecha'], unique=False)
        op.create_index(op.f('ix_auditoria_actor_id'), 'auditoria', ['actor_id'], unique=False)
    """