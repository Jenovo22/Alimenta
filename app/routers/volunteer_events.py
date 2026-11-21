"""Volunteer event API endpoints for managing community volunteer events."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_donations_session
from ..models.volunteer_event import VolunteerEvent
from ..models.user import User

router = APIRouter(prefix="/volunteer-events", tags=["volunteer-events"])


# Valid statuses for volunteer events
VALID_STATUSES = ["Pendiente de revisión", "Publicada", "Rechazada"]


@router.get("", response_model=List[VolunteerEvent])
def list_events(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    account_id: Optional[int] = None,
    session: Session = Depends(get_donations_session)
):
    """List volunteer events, optionally filtered by status or account."""
    query = select(VolunteerEvent)
    if status:
        query = query.where(VolunteerEvent.status == status)
    if account_id:
        query = query.where(VolunteerEvent.account_id == account_id)
    events = session.exec(query.order_by(VolunteerEvent.date).offset(skip).limit(limit)).all()
    return events


@router.get("/pending", response_model=List[VolunteerEvent])
def list_pending_events(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_donations_session)
):
    """List all pending volunteer events for moderation."""
    events = session.exec(
        select(VolunteerEvent).where(VolunteerEvent.status == "Pendiente de revisión").offset(skip).limit(limit)
    ).all()
    return events


@router.get("/{event_id}", response_model=VolunteerEvent)
def read_event(event_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific volunteer event by ID."""
    event = session.get(VolunteerEvent, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return event


@router.post("", response_model=VolunteerEvent, status_code=status.HTTP_201_CREATED)
def create_event(
    account_id: int,
    event_type: str,
    volunteer_name: str,
    venue: str,
    date: datetime,
    start_time: str,
    end_time: str,
    session: Session = Depends(get_donations_session)
):
    """Create a new volunteer event (requires edil account)."""
    # Verify the account exists and is an edil or admin
    account = session.get(User, account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    if account.role not in ["edil", "administrador"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only ediles and administrators can create volunteer events"
        )

    event = VolunteerEvent(
        account_id=account_id,
        event_type=event_type,
        volunteer_name=volunteer_name,
        venue=venue,
        date=date,
        start_time=start_time,
        end_time=end_time,
        status="Pendiente de revisión"
    )
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.patch("/{event_id}/moderate", response_model=VolunteerEvent)
def moderate_event(
    event_id: int,
    action: str,  # "approve" or "reject"
    session: Session = Depends(get_donations_session)
):
    """Moderate a volunteer event."""
    event = session.get(VolunteerEvent, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if event.status != "Pendiente de revisión":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending events can be moderated"
        )

    if action == "approve":
        event.status = "Publicada"
    elif action == "reject":
        event.status = "Rechazada"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Action must be 'approve' or 'reject'"
        )

    session.add(event)
    session.commit()
    session.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    session: Session = Depends(get_donations_session)
):
    """Delete a volunteer event."""
    event = session.get(VolunteerEvent, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    session.delete(event)
    session.commit()
    return None