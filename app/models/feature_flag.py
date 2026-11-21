"""Feature flag model definition using SQLModel."""

from sqlmodel import Field, SQLModel

class FeatureFlag(SQLModel, table=True):
    """Represents a feature flag.

    Attributes:
        name: Unique identifier for the flag (primary key).
        enabled: Whether the feature is active.
        description: Optional human-readable description.
    """

    name: str = Field(primary_key=True, max_length=100)
    enabled: bool = Field(default=False)
    description: str | None = Field(default=None, max_length=255)

    __tablename__ = "feature_flags"
