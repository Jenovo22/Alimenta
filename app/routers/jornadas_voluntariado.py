"""Router for volunteer days (jornadas de voluntariado) endpoints."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_donations_session
from ..models.volunteer_event import VolunteerEvent

router = APIRouter(prefix="/jornadas", tags=["jornadas_voluntariado"])


@router.get("/", response_model=List[VolunteerEvent])
def list_jornadas(
    skip: int = 0,
    limit: int = 100,
    community_id: int = None,
    session: Session = Depends(get_donations_session)
):
    """List volunteer days (jornadas), optionally filtered by community."""
    query = select(VolunteerEvent)
    jornadas = session.exec(query.order_by(VolunteerEvent.date).offset(skip).limit(limit)).all()
    return jornadas


@router.get("/{jornada_id}", response_model=VolunteerEvent)
def read_jornada(jornada_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific volunteer day by ID."""
    jornada = session.get(VolunteerEvent, jornada_id)
    if not jornada:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jornada not found")
    return jornada


@router.post("/", response_model=VolunteerEvent, status_code=status.HTTP_201_CREATED)
def create_jornada(
    account_id: int,
    event_type: str,
    volunteer_name: str,
    venue: str,
    date: str,  # ISO format date
    start_time: str,
    end_time: str,
    session: Session = Depends(get_donations_session)
):
    """Create a new volunteer day (jornada)."""
    from datetime import datetime
    from ..models.user import User
    
    # Verify the account exists and is an edil or admin
    account = session.get(User, account_id)
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    if account.role not in ["edil", "administrador"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only ediles and administrators can create volunteer days"
        )

    jornada = VolunteerEvent(
        account_id=account_id,
        event_type=event_type,
        volunteer_name=volunteer_name,
        venue=venue,
        date=datetime.fromisoformat(date.replace('Z', '+00:00').replace('+00:00', '')),
        start_time=start_time,
        end_time=end_time,
        status="Pendiente de revisión"
    )
    session.add(jornada)
    session.commit()
    session.refresh(jornada)
    return jornada


@router.get("/example")
async def example_endpoint():
    return {"message": "Jornadas Voluntariado endpoint active"}