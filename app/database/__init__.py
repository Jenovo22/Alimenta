"""Database connection and session handling using SQLModel (SQLite)."""

from sqlmodel import SQLModel, create_engine, Session
from contextlib import contextmanager
import os

# Load environment variables from .env file if it exists
try:
    from pathlib import Path
    env_path = Path(__file__).parent.parent.parent / ".env"
    if env_path.exists():
        from dotenv import load_dotenv
        load_dotenv(dotenv_path=env_path)
except ImportError:
    # dotenv not installed, skip
    pass

# Default database URL for feature flags (existing)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./feature_flags.db")

# Donations database URL
DONATIONS_DB_URL = os.getenv("DONATIONS_DB_URL", "sqlite:///./donations.db")

# Create engines (allow SQLite connections across FastAPI worker threads)
_db_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
_donations_connect_args = {"check_same_thread": False} if DONATIONS_DB_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=False, connect_args=_db_connect_args)
donations_engine = create_engine(DONATIONS_DB_URL, echo=False, connect_args=_donations_connect_args)


def get_session() -> Session:
    """FastAPI dependency that provides a database session for the default database."""
    with Session(engine) as session:
        yield session


def get_donations_session() -> Session:
    """FastAPI dependency that provides a database session for the donations database."""
    with Session(donations_engine) as session:
        yield session


@contextmanager
def get_manual_session(db_url: str = None):
    """Context manager for manual session handling with optional database URL."""
    engine_to_use = create_engine(db_url) if db_url else engine
    with Session(engine_to_use) as session:
        yield session


def init_db() -> None:
    """Create database tables if they do not exist in the default database."""
    from ..models import FeatureFlag
    FeatureFlag.metadata.create_all(engine)


def init_donations_db() -> None:
    """Create database tables if they do not exist in the donations database."""
    # Import all donations models to register their metadata
    from ..models import User, Community, EdilCommunityLink, ProductCategory, Product
    from ..models import AvailabilityWindow, VolunteerEvent, Organization, Need, Donation
    from ..models import Inventory, InventoryMovement
    
    # Create tables using SQLModel's metadata
    # All models inherit from SQLModel and share the same metadata when table=True
    SQLModel.metadata.create_all(donations_engine)

__all__ = ["seed_database", "engine", "donations_engine", "get_session", "get_donations_session", "init_db", "init_donations_db"]

from .seed import seed_database