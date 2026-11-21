"""Auth dependencies for FastAPI endpoints."""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from .auth import decode_access_token
from ..database import get_donations_session
from ..models.user import User
from sqlmodel import Session, select

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_donations_session)
) -> User:
    """Get current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    try:
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise credentials_exception
    
    user = session.get(User, user_id)
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user


def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require admin role."""
    if current_user.role not in ["administrador", "agente"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or agent role required"
        )
    return current_user


def get_current_edil_or_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require edil or admin role."""
    if current_user.role not in ["edil", "administrador"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Edil or admin role required"
        )
    return current_user
