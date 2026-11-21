"""Pydantic schemas for Donation entity."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class DonationBase(BaseModel):
    """Base schema for Donation with common fields."""

    model_config = ConfigDict(from_attributes=True)
    
    donor_id: int = Field(..., description="ID of the donor user")
    product_id: int = Field(..., description="ID of the product")
    quantity: int = Field(..., ge=1, description="Quantity offered")
    modality: str = Field(..., max_length=20, description="Donation modality: BANCO, DIRECTA, DIRIGIDA_EDIL")
    edil_id: Optional[int] = Field(default=None, description="Optional ID of the edil")
    need_id: Optional[int] = Field(default=None, description="Optional ID of the need")
    window_id: Optional[int] = Field(default=None, description="Optional ID of the availability window for delivery")
    transportador_id: Optional[int] = Field(default=None, description="Optional ID of the transport donor")


class DonationCreate(DonationBase):
    """Schema for creating a new donation."""

    pass


class DonationRead(DonationBase):
    """Schema for reading a donation with all fields."""

    id: int
    status: str
    appointment_status: str
    transport_status: str
    receipt_status: str
    created_at: datetime
    updated_at: datetime


class DonationUpdate(BaseModel):
    """Schema for updating donation status fields."""

    model_config = ConfigDict(from_attributes=True)
    
    status: Optional[str] = Field(None, max_length=50, description="Offer status")
    appointment_status: Optional[str] = Field(None, max_length=50, description="Appointment status")
    transport_status: Optional[str] = Field(None, max_length=30, description="Transport status")
    receipt_status: Optional[str] = Field(None, max_length=30, description="Receipt status")
    window_id: Optional[int] = Field(None, description="ID of the availability window")
    transportador_id: Optional[int] = Field(None, description="ID of the transport donor")