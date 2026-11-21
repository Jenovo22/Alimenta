"""Need API endpoints for managing community needs."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_donations_session
from ..models.need import Need
from ..models.donation import Donation
from ..models.user import User
from ..models.product import Product

router = APIRouter(prefix="/needs", tags=["needs"])


@router.get("", response_model=List[Need])
def list_needs(
    skip: int = 0,
    limit: int = 100,
    edil_id: Optional[int] = None,
    community_id: Optional[int] = None,
    is_satisfied: Optional[bool] = None,
    session: Session = Depends(get_donations_session)
):
    """List needs, optionally filtered by edil, community, or satisfaction status."""
    query = select(Need)
    if edil_id:
        query = query.where(Need.edil_id == edil_id)
    if community_id:
        query = query.where(Need.community_id == community_id)
    if is_satisfied is not None:
        query = query.where(Need.is_satisfied == is_satisfied)
    needs = session.exec(query.order_by(Need.created_at.desc()).offset(skip).limit(limit)).all()
    return needs


@router.get("/public", response_model=List[Need])
def list_public_needs(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_donations_session)
):
    """List all unsatisfied needs (public view)."""
    needs = session.exec(
        select(Need).where(Need.is_satisfied == False).order_by(Need.created_at.desc()).offset(skip).limit(limit)
    ).all()
    return needs


@router.get("/{need_id}", response_model=Need)
def read_need(need_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific need by ID."""
    need = session.get(Need, need_id)
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")
    return need


@router.post("", response_model=Need, status_code=status.HTTP_201_CREATED)
def create_need(
    edil_id: int,
    community_id: int,
    product_id: int,
    quantity: int,
    description: Optional[str] = None,
    session: Session = Depends(get_donations_session)
):
    """Create a new need (requires edil account)."""
    # Verify the edil exists
    edil = session.get(User, edil_id)
    if not edil or edil.role != "edil":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only ediles can create needs"
        )

    # Verify product exists
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    need = Need(
        edil_id=edil_id,
        community_id=community_id,
        product_id=product_id,
        quantity=quantity,
        description=description,
        status="Publicada",
        is_satisfied=False
    )
    session.add(need)
    session.commit()
    session.refresh(need)
    return need


@router.patch("/{need_id}/satisfy", response_model=Need)
def satisfy_need(need_id: int, session: Session = Depends(get_donations_session)):
    """Mark a need as satisfied."""
    need = session.get(Need, need_id)
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    need.is_satisfied = True
    need.status = "Satisfecha"
    need.updated_at = datetime.utcnow()
    session.add(need)
    session.commit()
    session.refresh(need)
    return need


@router.delete("/{need_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_need(need_id: int, session: Session = Depends(get_donations_session)):
    """Delete a need."""
    need = session.get(Need, need_id)
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    # Only delete if not satisfied
    if need.is_satisfied:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a satisfied need"
        )

    session.delete(need)
    session.commit()
    return None


@router.get("/{need_id}/donations", response_model=List[Donation])
def list_donations_for_need(need_id: int, session: Session = Depends(get_donations_session)):
    """List all donations that address a specific need."""
    need = session.get(Need, need_id)
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    donations = session.exec(
        select(Donation).where(Donation.need_id == need_id).order_by(Donation.created_at.desc())
    ).all()
    return donations


@router.patch("/{need_id}/cancel", response_model=Need)
def cancel_need(need_id: int, session: Session = Depends(get_donations_session)):
    """Cancel a need (mark as canceled)."""
    need = session.get(Need, need_id)
    if not need:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Need not found")

    if need.is_satisfied:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel a satisfied need"
        )

    need.status = "Cancelada"
    need.updated_at = datetime.utcnow()
    session.add(need)
    session.commit()
    session.refresh(need)
    return need