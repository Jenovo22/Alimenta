"""Appointment model definition using SQLModel. 

DEPRECATED: This model is no longer used. Appointment functionality has been
incorporated into the Donation model. Use Donation with window_id and status
fields for scheduling donation deliveries.

This file is kept for backward compatibility and will be removed in a future version.
"""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class Appointment(SQLModel, table=False):
    """Appointment entity for donation delivery scheduling.
    
    This is now a read-only view/schema that combines Donation fields.
    The actual data is stored in the 'donaciones' table.
    
    For new development, use the Donation model directly.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    window_id: int = Field(foreign_key="ventanas_disponibilidad.id")
    donor_id: int = Field(foreign_key="usuarios.id")
    product_id: int = Field(foreign_key="productos.id")
    transportador_id: Optional[int] = Field(
        default=None, foreign_key="usuarios.id", description="Optional transport donor"
    )
    quantity: int = Field(default=1, ge=1, description="Quantity for this appointment")
    status: str = Field(default="requested", max_length=20, description="Appointment status: requested, accepted, canceled, completed")
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "appointments"  # Read-only/deprecated