"""User API endpoints for managing users and authentication."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlmodel import Session, select, func

from ..database import get_donations_session
from ..models.user import User
from ..auth import hash_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=List[User])
def list_users(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_donations_session)
):
    """List all users with pagination."""
    users = session.exec(select(User).offset(skip).limit(limit)).all()
    return users


@router.post("", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(
    email: str,
    name: str,
    role: str = "donante",
    password: str = None,
    session: Session = Depends(get_donations_session)
):
    """Create a new user."""
    # Check if email already exists
    existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )

    # Hash password
    password_hash = hash_password(password or "default_password")

    user = User(
        email=email,
        name=name,
        role=role,
        password_hash=password_hash,
        is_active=True
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("/{user_id}", response_model=User)
def read_user(user_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific user by ID."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.get("/by-role/{role}", response_model=List[User])
def get_users_by_role(role: str, session: Session = Depends(get_donations_session)):
    """Get all users with a specific role."""
    users = session.exec(select(User).where(User.role == role)).all()
    return users


@router.patch("/{user_id}/deactivate", response_model=User)
def deactivate_user(user_id: int, session: Session = Depends(get_donations_session)):
    """Deactivate a user account."""
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_active = False
    user.updated_at = datetime.utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    return user