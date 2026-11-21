"""Product model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class Product(SQLModel, table=True):
    """Represents a donationable product.
 
    Products belong to categories and can be tracked separately.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        category_id: Foreign key to product_categories(id).
        name: Product name.
        description: Product description.
        unit: Unit of measurement (e.g., "kg", "unidad", "paquete").
        is_perishable: Whether the product has a limited shelf life.
        is_active: Whether the product is active/available for donations.
        sort_order: Display order for sorting.
        created_at: Timestamp when the product was created.
        updated_at: Timestamp when the product was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="categorias_productos.id")
    name: str = Field(max_length=100, nullable=False)
    description: Optional[str] = Field(default=None, max_length=500)
    unit: Optional[str] = Field(default=None, max_length=50)
    is_perishable: bool = Field(default=False)
    is_active: bool = Field(default=True)
    sort_order: int = Field(default=0)
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "productos"