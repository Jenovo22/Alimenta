"""Pydantic schemas for Appointment entity.

DEPRECATED: This module now uses Donation schemas directly.
The appointment functionality is part of the unified Donation model.
This file is kept for backward compatibility.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# Re-export from donation schemas for backward compatibility
from .donation import DonationBase, DonationCreate, DonationRead, DonationUpdate


class AppointmentCreate(DonationBase):
    """Schema for creating a new appointment (deprecated - use DonationCreate).

    Extends DonationBase with appointment-specific window and transport fields.
    """

    window_id: Optional[int] = Field(
        default=None,
        description="ID of the availability window for delivery (optional until scheduled)"
    )
    transportador_id: Optional[int] = Field(
        default=None, description="Optional ID of the transport donor"
    )
    quantity: int = Field(default=1, ge=1, description="Quantity for this donation")
    modality: str = Field(default="BANCO", max_length=20, description="Donation modality")


class AppointmentRead(DonationRead):
    """Schema for reading an appointment (deprecated - use DonationRead)."""

    window_id: Optional[int] = Field(default=None, description="ID of the availability window")
    transportador_id: Optional[int] = Field(default=None, description="Optional ID of the transport donor")


class AppointmentUpdate(BaseModel):
    """Schema for updating an appointment status (deprecated - use DonationUpdate)."""

    appointment_status: Optional[str] = Field(
        None,
        max_length=50,
        description="New status: Pendiente de aceptación, Aceptada, Rechazada"
    )


# Backward compatibility exports
__all__ = [
    "DonationBase",
    "DonationCreate",
    "DonationRead",
    "DonationUpdate",
    "AppointmentCreate",
    "AppointmentRead",
    "AppointmentUpdate",
]