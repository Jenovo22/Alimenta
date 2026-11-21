"""Database connection and session handling using SQLModel (SQLite)."""

from sqlmodel import SQLModel, create_engine, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./feature_flags.db")

engine = create_engine(DATABASE_URL, echo=False)

def get_session() -> Session:
    """FastAPI dependency that provides a database session."""
    with Session(engine) as session:
        yield session

def init_db() -> None:
    """Create database tables if they do not exist."""
    SQLModel.metadata.create_all(engine)
