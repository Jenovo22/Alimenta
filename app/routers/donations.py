"""Donation API endpoints for managing donations and offers."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, text

from ..database import get_donations_session, donations_engine
from ..models.donation import Donation
from ..models.availability_window import AvailabilityWindow
from ..models.product import Product
from ..models.user import User

router = APIRouter(prefix="/donations", tags=["donations"])


# Valid statuses
VALID_OFFER_STATUSES = ["Ofrecida", "Rechazada"]
VALID_APPOINTMENT_STATUSES = ["Pendiente de aceptación", "Aceptada", "Rechazada"]
VALID_TRANSPORT_STATUSES = ["Pendiente", "En transporte"]
VALID_RECEIPT_STATUSES = ["Pendiente", "Confirmada"]
VALID_MODALITIES = ["BANCO", "DIRECTA", "DIRIGIDA_EDIL"]


@router.get("/", response_model=List[Donation])
def list_donations(
    skip: int = 0,
    limit: int = 100,
    donor_id: Optional[int] = None,
    edil_id: Optional[int] = None,
    modality: Optional[str] = None,
    status: Optional[str] = None,
    appointment_status: Optional[str] = None,
    transport_status: Optional[str] = None,
    receipt_status: Optional[str] = None,
    window_id: Optional[int] = None,
    need_id: Optional[int] = None,
    session: Session = Depends(get_donations_session)
):
    """List donations, optionally filtered by various criteria."""
    query = select(Donation)

    if donor_id:
        query = query.where(Donation.donor_id == donor_id)
    if edil_id:
        query = query.where(Donation.edil_id == edil_id)
    if modality:
        query = query.where(Donation.modality == modality)
    if status:
        query = query.where(Donation.status == status)
    if appointment_status:
        query = query.where(Donation.appointment_status == appointment_status)
    if transport_status:
        query = query.where(Donation.transport_status == transport_status)
    if receipt_status:
        query = query.where(Donation.receipt_status == receipt_status)
    if window_id:
        query = query.where(Donation.window_id == window_id)
    if need_id:
        query = query.where(Donation.need_id == need_id)

    donations = session.exec(query.order_by(Donation.created_at.desc()).offset(skip).limit(limit)).all()
    return donations


@router.get("/{donation_id}", response_model=Donation)
def read_donation(donation_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific donation by ID."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")
    return donation


@router.post("/", response_model=Donation, status_code=status.HTTP_201_CREATED)
def create_donation(
    donor_id: int,
    product_id: int,
    quantity: int,
    modality: str,
    edil_id: Optional[int] = None,
    need_id: Optional[int] = None,
    window_id: Optional[int] = None,
    transportador_id: Optional[int] = None,
    session: Session = Depends(get_donations_session)
):
    """Create a new donation/offer.

    Modalities:
    - BANCO: Donation to the community food bank
    - DIRECTA: Direct donation to a published need
    - DIRIGIDA_EDIL: Directed donation to a specific edil

    For DIRECTA modality, need_id should be provided.
    For BANCO modality, window_id can be provided for scheduling.
    """
    # Validate modality
    if modality not in VALID_MODALITIES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid modality. Must be one of: {VALID_MODALITIES}"
        )

    # Verify donor exists
    donor = session.get(User, donor_id)
    if not donor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donor not found")

    # Verify product exists
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    # For DIRIGIDA_EDIL, edil_id is required
    if modality == "DIRIGIDA_EDIL" and not edil_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="edil_id is required for DIRIGIDA_EDIL modality")

    # Verify edil exists if provided
    if edil_id:
        edil = session.get(User, edil_id)
        if not edil or edil.role != "edil":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or unauthorized edil")

    # Verify window exists if provided
    if window_id:
        window = session.get(AvailabilityWindow, window_id)
        if not window:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Availability window not found")

    # Verify transportador exists if provided
    if transportador_id:
        transportador = session.get(User, transportador_id)
        if not transportador or transportador.role != "agente":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid transportador")

    donation = Donation(
        donor_id=donor_id,
        edil_id=edil_id,
        need_id=need_id,
        window_id=window_id,
        transportador_id=transportador_id,
        product_id=product_id,
        quantity=quantity,
        modality=modality,
        status="Ofrecida",
        appointment_status="Pendiente de aceptación",
        transport_status="Pendiente",
        receipt_status="Pendiente"
    )
    session.add(donation)
    session.commit()
    session.refresh(donation)

    # Record metric
    from app.main import donations_created
    donations_created.inc()

    return donation


@router.patch("/{donation_id}", response_model=Donation)
def update_donation(
    donation_id: int,
    status: Optional[str] = None,
    appointment_status: Optional[str] = None,
    transport_status: Optional[str] = None,
    receipt_status: Optional[str] = None,
    session: Session = Depends(get_donations_session)
):
    """Update donation status fields."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    if status and status in VALID_OFFER_STATUSES:
        donation.status = status
    if appointment_status and appointment_status in VALID_APPOINTMENT_STATUSES:
        donation.appointment_status = appointment_status
    if transport_status and transport_status in VALID_TRANSPORT_STATUSES:
        donation.transport_status = transport_status
    if receipt_status and receipt_status in VALID_RECEIPT_STATUSES:
        donation.receipt_status = receipt_status

    donation.updated_at = datetime.utcnow()
    session.add(donation)
    session.commit()
    session.refresh(donation)
    return donation


@router.post("/{donation_id}/accept", response_model=Donation)
def accept_donation(donation_id: int, session: Session = Depends(get_donations_session)):
    """Accept a donation offer."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    if donation.status != "Ofrecida":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only offered donations can be accepted")

    donation.status = "Ofrecida"  # Still offered after acceptance
    donation.appointment_status = "Aceptada"
    donation.updated_at = datetime.utcnow()
    session.add(donation)
    session.commit()
    session.refresh(donation)
    return donation


@router.post("/{donation_id}/reject", response_model=Donation)
def reject_donation(donation_id: int, session: Session = Depends(get_donations_session)):
    """Reject a donation offer."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    donation.status = "Rechazada"
    donation.appointment_status = "Rechazada"
    donation.transport_status = "Pendiente"
    donation.receipt_status = "Pendiente"
    donation.updated_at = datetime.utcnow()
    session.add(donation)
    session.commit()
    session.refresh(donation)
    return donation


@router.post("/{donation_id}/mark-transport", response_model=Donation)
def mark_transport(donation_id: int, session: Session = Depends(get_donations_session)):
    """Mark donation as in transport."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    if donation.appointment_status != "Aceptada":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Donation must be accepted first")

    donation.transport_status = "En transporte"
    donation.updated_at = datetime.utcnow()
    session.add(donation)
    session.commit()
    session.refresh(donation)
    return donation


@router.post("/{donation_id}/confirm-receipt", response_model=Donation)
def confirm_receipt(donation_id: int, session: Session = Depends(get_donations_session)):
    """Confirm physical receipt of donation."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    if donation.transport_status != "En transporte":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Donation must be in transport first")

    donation.receipt_status = "Confirmada"
    donation.updated_at = datetime.utcnow()
    session.add(donation)
    session.commit()
    session.refresh(donation)

    # Update inventory
    from app.main import donations_confirmed
    donations_confirmed.inc()

    return donation


@router.post("/{donation_id}/cancel", response_model=Donation)
def cancel_donation(donation_id: int, session: Session = Depends(get_donations_session)):
    """Cancel a donation offer."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    if donation.status == "Rechazada":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Donation is already rejected")

    donation.status = "Rechazada"
    donation.appointment_status = "Rechazada"
    donation.updated_at = datetime.utcnow()
    session.add(donation)
    session.commit()
    session.refresh(donation)
    return donation


@router.post("/{donation_id}/assign-window", response_model=Donation)
def assign_window(
    donation_id: int,
    window_id: int,
    session: Session = Depends(get_donations_session)
):
    """Assign a donation to a specific availability window."""
    donation = session.get(Donation, donation_id)
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")

    window = session.get(AvailabilityWindow, window_id)
    if not window:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Availability window not found")

    # Check if window still has capacity
    from sqlmodel import select

    donation.window_id = window_id
    donation.updated_at = datetime.utcnow()
    session.add(donation)
    session.commit()
    session.refresh(donation)
    return donation


@router.get("/by-need/{need_id}", response_model=List[Donation])
def list_donations_by_need(need_id: int, session: Session = Depends(get_donations_session)):
    """List donations that address a specific need."""
    donations = session.exec(
        select(Donation).where(Donation.need_id == need_id).order_by(Donation.created_at.desc())
    ).all()
    return donations


@router.get("/by-window/{window_id}", response_model=List[Donation])
def list_donations_by_window(window_id: int, session: Session = Depends(get_donations_session)):
    """List donations assigned to a specific window."""
    donations = session.exec(
        select(Donation).where(Donation.window_id == window_id).order_by(Donation.created_at.desc())
    ).all()
    return donations