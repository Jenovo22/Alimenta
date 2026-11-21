"""Availability window API endpoints for managing donation availability windows."""

from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func

from ..database import get_donations_session
from ..models.availability_window import AvailabilityWindow
from ..models.user import User

router = APIRouter(prefix="/availability", tags=["availability"])


# Valid statuses for availability windows
VALID_STATUSES = ["ACTIVE", "INACTIVE", "COMPLETED"]


@router.get("", response_model=List[AvailabilityWindow])
def list_windows(
    skip: int = 0,
    limit: int = 100,
    owner_id: Optional[int] = None,
    owner_type: Optional[str] = None,
    community_id: Optional[int] = None,
    status: Optional[str] = None,
    session: Session = Depends(get_donations_session)
):
    """List availability windows, optionally filtered."""
    query = select(AvailabilityWindow)
    if owner_id:
        query = query.where(AvailabilityWindow.owner_id == owner_id)
    if owner_type:
        query = query.where(AvailabilityWindow.owner_type == owner_type)
    if community_id:
        query = query.where(AvailabilityWindow.community_id == community_id)
    if status:
        query = query.where(AvailabilityWindow.status == status)
    windows = session.exec(query.order_by(AvailabilityWindow.start_datetime).offset(skip).limit(limit)).all()
    return windows


@router.get("/public", response_model=List[AvailabilityWindow])
def list_public_windows(
    days_ahead: int = 14,
    session: Session = Depends(get_donations_session)
):
    """List public availability windows for donors to browse."""
    # Only active windows within the next N days
    cutoff_date = datetime.utcnow() + timedelta(days=days_ahead)
    windows = session.exec(
        select(AvailabilityWindow).where(
            AvailabilityWindow.status == "ACTIVE",
            AvailabilityWindow.start_datetime >= datetime.utcnow(),
            AvailabilityWindow.start_datetime <= cutoff_date
        ).order_by(AvailabilityWindow.start_datetime).all()
    )
    return windows


@router.get("/{window_id}", response_model=AvailabilityWindow)
def read_window(window_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific availability window by ID."""
    window = session.get(AvailabilityWindow, window_id)
    if not window:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Window not found")
    return window


@router.post("", response_model=AvailabilityWindow, status_code=status.HTTP_201_CREATED)
def create_window(
    owner_id: int,
    owner_type: str,  # EDIL or BANCO
    community_id: Optional[int] = None,
    start_datetime: datetime = None,
    end_datetime: datetime = None,
    duration_minutes: int = 60,
    capacity: Optional[int] = None,
    slot_label: Optional[str] = None,
    session: Session = Depends(get_donations_session)
):
    """Create a new availability window."""
    # Verify the owner exists and has the right role
    owner = session.get(User, owner_id)
    if not owner:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Owner not found")

    if owner_type == "EDIL" and owner.role != "edil":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only ediles can create edil windows")
    if owner_type == "BANCO" and owner.role not in ["agente", "administrador"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only agents and admins can create bank windows")

    window = AvailabilityWindow(
        owner_id=owner_id,
        owner_type=owner_type,
        community_id=community_id,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        duration_minutes=duration_minutes,
        capacity=capacity,
        status="ACTIVE",
        slot_label=slot_label
    )
    session.add(window)
    session.commit()
    session.refresh(window)
    return window


@router.patch("/{window_id}", response_model=AvailabilityWindow)
def update_window(
    window_id: int,
    status: Optional[str] = None,
    capacity: Optional[int] = None,
    session: Session = Depends(get_donations_session)
):
    """Update an availability window."""
    window = session.get(AvailabilityWindow, window_id)
    if not window:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Window not found")

    if status and status in VALID_STATUSES:
        window.status = status
    if capacity is not None:
        window.capacity = capacity

    window.updated_at = datetime.utcnow()
    session.add(window)
    session.commit()
    session.refresh(window)
    return window


@router.delete("/{window_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_window(
    window_id: int,
    session: Session = Depends(get_donations_session)
):
    """Delete an availability window."""
    window = session.get(AvailabilityWindow, window_id)
    if not window:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Window not found")

    session.delete(window)
    session.commit()
    return None