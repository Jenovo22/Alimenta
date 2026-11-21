"""Community model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class Community(SQLModel, table=True):
    """Represents a community/neighborhood in Alimenta.

    Communities are managed by Ediles who serve as official representatives.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        name: Community/neighborhood name.
        description: Optional description of the community.
        code: Optional unique code for the community.
        is_verified: Whether the community has been verified.
        created_at: Timestamp when the community was created.
        updated_at: Timestamp when the community was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    code: Optional[str] = Field(default=None, max_length=50, sa_column_kwargs={"unique": True})
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "comunidades"


class EdilCommunityLink(SQLModel, table=True):
    """Links Ediles to the communities they represent.

    Attributes:
        edil_id: Foreign key to usuarios(id) for the edil.
        community_id: Foreign key to comunidades(id).
        created_at: Timestamp when the link was created.
    """

    edil_id: int = Field(foreign_key="usuarios.id", primary_key=True)
    community_id: int = Field(foreign_key="comunidades.id", primary_key=True)
    created_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "ediles_comunidades"