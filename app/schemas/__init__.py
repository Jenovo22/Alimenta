"""Pydantic schemas package for Alimenta API."""

from .token import Token, TokenPayload
from .appointment import (
    AppointmentCreate,
    AppointmentRead,
    AppointmentUpdate,
    # Re-exported from donation
    DonationBase,
    DonationCreate,
    DonationRead,
    DonationUpdate,
)
from .donation import (
    DonationBase as _DonationBase,
    DonationCreate as _DonationCreate,
    DonationRead as _DonationRead,
    DonationUpdate as _DonationUpdate,
    # These are already re-exported via appointment import
    # DonationBase, DonationCreate, DonationRead, DonationUpdate,
)
from .need import (
    NeedBase,
    NeedCreate,
    NeedRead,
    NeedUpdate,
)
from .user import UserResponse, UserCreate

__all__ = [
    # Authentication
    "Token",
    "TokenPayload",
    # Donation schemas (primary)
    "DonationBase",
    "DonationCreate",
    "DonationRead",
    "DonationUpdate",
    # Appointment schemas (deprecated, use DonationCreate/Read instead)
    "AppointmentCreate",
    "AppointmentRead",
    "AppointmentUpdate",
    # Need schemas
    "NeedBase",
    "NeedCreate",
    "NeedRead",
    "NeedUpdate",
    # User schemas
    "UserResponse",
    "UserCreate",
]