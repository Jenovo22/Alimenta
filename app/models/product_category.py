"""Product category model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import ConfigDict


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class ProductCategory(SQLModel, table=True):
    """Represents a category of products for donations.

    Categories have a hierarchical structure: root categories can have
    subcategories.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        name: Category name.
        description: Category description.
        parent_id: Optional foreign key to parent category (for hierarchy).
        is_active: Whether the category is active/available for donations.
        sort_order: Display order for sorting.
        created_at: Timestamp when the category was created.
        updated_at: Timestamp when the category was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, nullable=False)
    description: Optional[str] = Field(default=None, max_length=500)
    parent_id: Optional[int] = Field(default=None, foreign_key="categorias_productos.id")
    is_active: bool = Field(default=True)
    sort_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "categorias_productos"


class ProductCategoryRead(SQLModel):
    """Read-only schema for ProductCategory."""
    
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    description: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool = True
    sort_order: int = 0
    created_at: datetime
    updated_at: datetime