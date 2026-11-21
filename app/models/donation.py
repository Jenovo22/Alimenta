"""Donation model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class Donation(SQLModel, table=True):
    """Represents a donation or offer in the Alimenta platform.

    Donations can be of three modalities:
    1. DIRECTA: Direct donation to a published need
    2. BANCO: Donation to the community food bank
    3. DIRIGIDA_EDIL: Directed donation to a specific edil

    The donation flows through several statuses:
    - Offer: Ofrecida, Rechazada
    - Appointment: Pendiente de aceptación, Aceptada, Rechazada
    - Transport: Pendiente, En transporte
    - Receipt: Pendiente, Confirmada

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        donor_id: Foreign key to usuarios(id) for the donor.
        edil_id: Optional foreign key to usuarios(id) for the edil.
        need_id: Optional foreign key to solicitudes(id) if linked to a need.
        window_id: Foreign key to ventanas_disponibilidad(id) for scheduling.
        transportador_id: Optional foreign key to usuarios(id) for the transport donor.
        product_id: Foreign key to productos(id).
        quantity: Quantity of the product offered.
        modality: Donation modality (BANCO, DIRECTA, DIRIGIDA_EDIL).
        status: Current status of the donation.
        appointment_status: Appointment/Donation status.
        transport_status: Transportation status.
        receipt_status: Physical receipt confirmation status.
        created_at: Timestamp when the donation was created.
        updated_at: Timestamp when the donation was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    donor_id: int = Field(foreign_key="usuarios.id", description="Donor who made the offer")
    edil_id: Optional[int] = Field(default=None, foreign_key="usuarios.id", description="Edil assigned or receiving")
    need_id: Optional[int] = Field(default=None, foreign_key="solicitudes.id", description="Optional need this donation addresses")
    window_id: Optional[int] = Field(default=None, foreign_key="ventanas_disponibilidad.id", description="Scheduled delivery window")
    transportador_id: Optional[int] = Field(default=None, foreign_key="usuarios.id", description="Optional transport donor")
    product_id: int = Field(foreign_key="productos.id", description="Product being donated")
    quantity: int = Field(default=1, description="Quantity offered", ge=1)

    # Modalidad: BANCO, DIRECTA, DIRIGIDA_EDIL
    modality: str = Field(max_length=20, description="Donation modality")

    # Status tracking
    status: str = Field(
        default="Ofrecida",
        max_length=50,
        description="Offer status: Ofrecida, Rechazada"
    )
    appointment_status: str = Field(
        default="Pendiente de aceptación",
        max_length=50,
        description="Appointment/Donation status"
    )
    transport_status: str = Field(
        default="Pendiente",
        max_length=30,
        description="Transport status: Pendiente, En transporte"
    )
    receipt_status: str = Field(
        default="Pendiente",
        max_length=30,
        description="Receipt status: Pendiente, Confirmada"
    )

    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "donaciones"