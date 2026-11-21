"""Organization model definition using SQLModel."""

from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


def _get_utc_now():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


class Organization(SQLModel, table=True):
    """Represents an allied organization.

    Organizations are featured in the Top 10 on the homepage.

    Attributes:
        id: Primary key (auto-incrementing SERIAL).
        name: Organization name.
        description: Organization description.
        logo_url: URL to the organization's logo.
        website_url: Organization website URL.
        rank_position: Position in the Top 10 ranking (1-10).
        is_verified: Whether the organization has been verified.
        created_at: Timestamp when the organization was created.
        updated_at: Timestamp when the organization was last updated.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    logo_url: Optional[str] = Field(default=None, max_length=500)
    website_url: Optional[str] = Field(default=None, max_length=500)
    rank_position: Optional[int] = Field(default=None, ge=1, le=10)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=_get_utc_now)
    updated_at: datetime = Field(default_factory=_get_utc_now)

    __tablename__ = "organizaciones_aliadas"