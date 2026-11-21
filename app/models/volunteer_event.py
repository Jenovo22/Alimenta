"""Volunteer event model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class VolunteerEvent(SQLModel, table=True):
    """Represents a community volunteer event/jornada.

    Events are registered by Ediles and require administrative moderation
    before becoming publicly visible. They are independent of donation
    appointments.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        account_id: Foreign key to usuarios(id) for the edil who created it.
        event_type: Type of volunteer activity (e.g., vaccination, counseling).
        volunteer_name: Name of the responsible volunteer.
        venue: Public venue name (no private addresses).
        date: Date of the event.
        start_time: Start time (HH:MM).
        end_time: End time (HH:MM).
        status: Event status - pending moderation, approved, or rejected.
        created_at: Timestamp when the event was created.
        updated_at: Timestamp when the event was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    account_id: int = Field(foreign_key="usuarios.id", description="Edil who created the event")
    event_type: str = Field(max_length=100, description="Type of volunteer activity")
    volunteer_name: str = Field(max_length=255, description="Name of responsible volunteer")
    venue: str = Field(max_length=500, description="Public venue (no private addresses)")
    date: datetime = Field(description="Date of the event")
    start_time: str = Field(max_length=8, description="Start time (HH:MM)")
    end_time: str = Field(max_length=8, description="End time (HH:MM)")
    status: str = Field(
        default="Pendiente de revisión",
        max_length=50,
        description="Status: Pending moderation, approved, or rejected"
    )
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "jornadas_voluntariado"