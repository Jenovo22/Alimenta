"""Pydantic schemas for Appointment entity."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AppointmentBase(BaseModel):
    """Base schema for Appointment with common fields."""

    window_id: int = Field(..., description="ID of the availability window")
    donor_id: int = Field(..., description="ID of the donor user")
    transportador_id: Optional[int] = Field(
        default=None, description="Optional ID of the transport donor"
    )
    status: str = Field(
        default="requested",
        max_length=20,
        description="Status: requested, accepted, canceled, completed"
    )

    class Config:
        orm_mode = True


class AppointmentCreate(AppointmentBase):
    """Schema for creating a new appointment."""

    pass


class AppointmentRead(AppointmentBase):
    """Schema for reading an appointment with all fields including timestamps."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class AppointmentUpdate(BaseModel):
    """Schema for updating an appointment status."""

    status: str = Field(
        ...,
        max_length=20,
        description="New status: requested, accepted, canceled, completed"
    )

    class Config:
        orm_mode = True