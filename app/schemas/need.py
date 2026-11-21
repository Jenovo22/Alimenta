"""Pydantic schemas for Need entity."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class NeedBase(BaseModel):
    """Base schema for Need with common fields."""

    model_config = ConfigDict(from_attributes=True)
    
    edil_id: int = Field(..., description="ID of the edil who created the need")
    community_id: int = Field(..., description="ID of the community")
    product_id: int = Field(..., description="ID of the product needed")
    quantity: int = Field(..., ge=1, description="Quantity needed")
    description: Optional[str] = Field(default=None, max_length=500, description="Description of the need")
    status: str = Field(
        default="Publicada",
        max_length=50,
        description="Status: Publicada, Satisfecha, Cancelada"
    )
    is_satisfied: bool = Field(default=False, description="Whether the need has been satisfied")


class NeedCreate(NeedBase):
    """Schema for creating a new need."""

    pass


class NeedRead(NeedBase):
    """Schema for reading a need with all fields."""

    id: int
    created_at: datetime
    updated_at: datetime


class NeedUpdate(BaseModel):
    """Schema for updating a need."""

    model_config = ConfigDict(from_attributes=True)
    
    description: Optional[str] = Field(default=None, max_length=500)
    status: Optional[str] = Field(default=None, max_length=50, description="Status: Publicada, Satisfecha, Cancelada")
    is_satisfied: Optional[bool] = Field(default=None, description="Whether the need has been satisfied")