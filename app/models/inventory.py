"""Inventory model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class Inventory(SQLModel, table=True):
    """Represents inventory items in the community food bank.

    Inventory tracks products that have been received and verified by agents.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        product_id: Foreign key to products(id).
        received_quantity: Total quantity received and verified.
        available_quantity: Quantity available for distribution.
        reserved_quantity: Quantity reserved for specific needs.
        dispatched_quantity: Quantity that has been dispatched/distributed.
        location: Optional location description within the bank.
        last_received_at: Timestamp of last physical receipt.
        created_at: Timestamp when the inventory item was created.
        updated_at: Timestamp when the inventory was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="productos.id", unique=True)
    received_quantity: int = Field(default=0, ge=0)
    available_quantity: int = Field(default=0, ge=0)
    reserved_quantity: int = Field(default=0, ge=0)
    dispatched_quantity: int = Field(default=0, ge=0)
    location: Optional[str] = Field(default=None, max_length=100)
    last_received_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "inventario_banco"


class InventoryMovement(SQLModel, table=True):
    """Represents a movement/increment in the inventory.

    Records each physical receipt, dispatch, or adjustment of inventory items.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        inventory_id: Foreign key to inventario_banco(id).
        movement_type: Type of movement (RECEIPT, DISPATCH, ADJUSTMENT).
        quantity: Quantity moved (positive for receipt, negative for dispatch).
        reference_donation_id: Optional reference to the donation that caused this movement.
        notes: Optional notes about the movement.
        created_by_id: Foreign key to usuarios(id) who performed the movement.
        created_at: Timestamp when the movement was recorded.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    inventory_id: int = Field(foreign_key="inventario_banco.id")
    movement_type: str = Field(max_length=20, description="Type: RECEIPT, DISPATCH, ADJUSTMENT")
    quantity: int = Field(description="Quantity moved")
    reference_donation_id: Optional[int] = Field(default=None)
    notes: Optional[str] = Field(default=None, max_length=500)
    created_by_id: int = Field(foreign_key="usuarios.id")
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "movimientos_inventario"