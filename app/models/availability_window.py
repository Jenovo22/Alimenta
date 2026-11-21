"""Availability window model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class AvailabilityWindow(SQLModel, table=True):
    """Represents an availability window for donations.

    Ediles and Agents publish windows during which they can receive
    donations or host volunteer events.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        owner_id: Foreign key to usuarios(id) for the edil/agent who owns this window.
        owner_type: Type of owner (EDIL, BANCO).
        community_id: Optional foreign key to comunidades(id).
        start_datetime: Start datetime of the window.
        end_datetime: End datetime of the window.
        duration_minutes: Duration in minutes (default 60).
        capacity: Maximum number of appointments/donations this window can accept.
        status: Window status (ACTIVE, INACTIVE, COMPLETED).
        slot_label: Optional label for the slot (e.g., "Mañana", "Tarde").
        created_at: Timestamp when the window was created.
        updated_at: Timestamp when the window was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="usuarios.id", description="Edil or agent who owns this window")
    owner_type: str = Field(max_length=10, description="Type: EDIL or BANCO")
    community_id: Optional[int] = Field(default=None, foreign_key="comunidades.id")

    start_datetime: datetime = Field(description="Start date and time of the window")
    end_datetime: datetime = Field(description="End date and time of the window")

    duration_minutes: int = Field(default=60, description="Duration of the window in minutes")
    capacity: Optional[int] = Field(default=None, description="Maximum appointments this window accepts")

    status: str = Field(
        default="ACTIVE",
        max_length=20,
        description="Status: ACTIVE, INACTIVE, COMPLETED"
    )
    slot_label: Optional[str] = Field(default=None, max_length=50, description="Label for the slot")

    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "ventanas_disponibilidad"