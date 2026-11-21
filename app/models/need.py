"""Need model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class Need(SQLModel, table=True):
    """Represents a need/solicitud in the Alimenta platform.

    Needs are published by Ediles for their communities and can be
    fulfilled by donating users.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        edil_id: Foreign key to usuarios(id) for the edil who created it.
        community_id: Foreign key to comunidades(id).
        product_id: Foreign key to productos(id) for the needed product.
        quantity: Quantity of the product needed.
        description: Optional description of the need.
        is_satisfied: Whether the need has been satisfied.
        status: Current status of the need.
        created_at: Timestamp when the need was created.
        updated_at: Timestamp when the need was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    edil_id: int = Field(foreign_key="usuarios.id", description="Edil who created the need")
    community_id: int = Field(foreign_key="comunidades.id", description="Community this need belongs to")
    product_id: int = Field(foreign_key="productos.id", description="Product needed")
    quantity: int = Field(default=1, description="Quantity needed", ge=1)
    description: Optional[str] = Field(default=None, max_length=500)
    is_satisfied: bool = Field(default=False)
    status: str = Field(
        default="Publicada",
        max_length=50,
        description="Status: Publicada, Satisfecha, Cancelada"
    )
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "solicitudes"