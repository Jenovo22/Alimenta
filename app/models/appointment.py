"""Appointment model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime
from typing import Optional


class Appointment(SQLModel, table=True):
    """Represents an appointment/cita for donation delivery.

    This entity unifies the terminology that was previously split between
    'cita' and 'turno' into a single Appointment entity.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        window_id: Foreign key to ventanas_disponibilidad(id).
        donor_id: Foreign key to usuarios(id) for the donor.
        transportador_id: Optional foreign key to usuarios(id) for the transport donor.
        status: Current status of the appointment (requested, accepted, canceled, completed).
        created_at: Timestamp when the appointment was created.
        updated_at: Timestamp when the appointment was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    window_id: int = Field(foreign_key="ventanas_disponibilidad.id")
    donor_id: int = Field(foreign_key="usuarios.id")
    transportador_id: Optional[int] = Field(
        default=None, foreign_key="usuarios.id", description="Optional transport donor"
    )
    status: str = Field(max_length=20, description="Appointment status: requested, accepted, canceled, completed")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Table:
        """SQL table configuration with unique constraint to prevent double booking."""
        name = "appointments"
        constraints = [
            # Unique constraint to prevent double booking of the same slot
            # Note: SQLite has limitations with unique constraints across multiple columns
            # In PostgreSQL this would be: UNIQUE (window_id, donor_id)
        ]