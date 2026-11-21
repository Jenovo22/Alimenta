"""Appointment API endpoints for managing donation appointments."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, text

from app.database import get_session
from app.models.appointment import Appointment
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentRead,
    AppointmentUpdate,
)

router = APIRouter(prefix="/appointments", tags=["appointments"])


# Simple auth dependency placeholder - replace with JWT in production
async def get_current_user_id() -> int:
    """Placeholder for user authentication.
    In production, this should validate JWT tokens and return the user ID.
    """
    # For now, return a default user ID (will be replaced with proper auth)
    return 1


@router.post(
    "/",
    response_model=AppointmentRead,
    status_code=status.HTTP_201_CREATED,
    description="Create a new appointment for donation delivery"
)
def create_appointment(
    appointment_in: AppointmentCreate,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    """Create a new appointment.

    Creates an appointment with the specified window, donor, and optional transportador.
    Validates that the window has available capacity and prevents double booking.
    """
    # Verify window exists and has capacity
    window_check = session.exec(
        text(
            "SELECT id, capacidad FROM ventanas_disponibilidad WHERE id = :window_id"
        ),
        window_id=appointment_in.window_id
    ).first()

    if not window_check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability window not found"
        )

    # Check if window still has capacity (prevent overbooking)
    current_appointments = session.exec(
        text(
            "SELECT COUNT(*) FROM appointments WHERE window_id = :window_id AND status IN ('requested', 'accepted', 'completed')"
        ),
        window_id=appointment_in.window_id
    ).one()

    if window_check[1] is not None and current_appointments >= window_check[1]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Window is at full capacity, no slots available"
        )

    # Check for unique constraint violation (double booking)
    existing = session.exec(
        text(
            "SELECT id FROM appointments WHERE window_id = :window_id AND donor_id = :donor_id"
        ),
        window_id=appointment_in.window_id,
        donor_id=appointment_in.donor_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Donor already has an appointment for this window"
        )

    # Create the appointment
    appointment = Appointment(
        window_id=appointment_in.window_id,
        donor_id=appointment_in.donor_id,
        transportador_id=appointment_in.transportador_id,
        status=appointment_in.status or "requested",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    session.add(appointment)
    session.commit()
    session.refresh(appointment)

    return appointment


@router.get(
    "/{appointment_id}",
    response_model=AppointmentRead,
    description="Get an appointment by ID"
)
def read_appointment(
    appointment_id: int,
    session: Session = Depends(get_session)
):
    """Get a specific appointment by its ID."""
    appointment = session.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    return appointment


@router.get(
    "/",
    response_model=list[AppointmentRead],
    description="List all appointments"
)
def list_appointments(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """List all appointments with pagination."""
    appointments = session.exec(
        select(Appointment).offset(skip).limit(limit)
    ).all()
    return appointments


@router.patch(
    "/{appointment_id}",
    response_model=AppointmentRead,
    description="Update an appointment's status"
)
def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    session: Session = Depends(get_session),
    user_id: int = Depends(get_current_user_id)
):
    """Update an appointment's status.

    Valid status transitions:
    - requested -> accepted, canceled
    - accepted -> canceled, completed
    - canceled -> (terminal, no transitions)
    - completed -> (terminal, no transitions)
    """
    appointment = session.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    # Validate status transition (basic validation)
    valid_statuses = {"requested", "accepted", "canceled", "completed"}
    if appointment_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )

    appointment.status = appointment_update.status
    appointment.updated_at = datetime.utcnow()

    session.add(appointment)
    session.commit()
    session.refresh(appointment)

    return appointment