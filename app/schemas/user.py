"""User schemas for API responses."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class UserResponse(BaseModel):
    """Response schema for user data returned to frontend."""
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    email: str
    name: str
    password: str
    role: str = "donante"
    is_active: bool = True