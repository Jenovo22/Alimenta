"""User model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    """Represents a user account in the Alimenta platform.

    Users can have different roles: donante, edil, agente, administrador.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        email: Unique email address for login.
        name: User's full name.
        role: User's role (donante, edil, agente, administrador).
        password_hash: Hashed password.
        is_active: Whether the user account is active.
        created_at: Timestamp when the user was created.
        updated_at: Timestamp when the user was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(max_length=255, nullable=False, sa_column_kwargs={"unique": True})
    name: str = Field(max_length=255, nullable=False)
    role: str = Field(max_length=50, nullable=False, default="donante")
    password_hash: str = Field(max_length=255, nullable=False)
    is_active: bool = Field(default=False)
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "usuarios"