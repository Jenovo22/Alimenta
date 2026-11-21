"""Authentication router for login and token management."""

from datetime import timedelta
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from ..auth import create_access_token, verify_password, decode_access_token
from ..database import get_donations_session
from ..models.user import User
from ..schemas.token import Token
from ..schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_donations_session)
) -> Any:
    """Login endpoint - authenticate user and return JWT token."""
    # Find user by email
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials: user not found"
        )
    
    # Verify password
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials: wrong password"
        )
    
    # Check if account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=60 * 24)  # 24 hours
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


@router.get("/me", response_model=UserResponse)
def get_current_user(
    token: str,
    session: Session = Depends(get_donations_session)
) -> Any:
    """Get current authenticated user information."""
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = int(payload.get("sub"))
    user = session.get(User, user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@router.post("/refresh", response_model=Token)
def refresh_token(
    token: str,
    session: Session = Depends(get_donations_session)
) -> Any:
    """Refresh an existing token."""
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = int(payload.get("sub"))
    user = session.get(User, user_id)
    
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }
