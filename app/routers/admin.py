"""Admin endpoints for managing feature flags."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from ..models.feature_flag import FeatureFlag
from ..database import get_session

router = APIRouter(prefix="/admin/feature-flags", tags=["admin"])

@router.get("/", response_model=list[FeatureFlag])
def list_flags(session: Session = Depends(get_session)):
    """Return all feature flags."""
    flags = session.exec(select(FeatureFlag)).all()
    return flags

@router.post("/", response_model=FeatureFlag, status_code=status.HTTP_201_CREATED)
def create_flag(flag: FeatureFlag, session: Session = Depends(get_session)):
    """Create a new feature flag. If it already exists, raise 409."""
    existing = session.get(FeatureFlag, flag.name)
    if existing:
        raise HTTPException(status_code=409, detail="Feature flag already exists")
    session.add(flag)
    session.commit()
    session.refresh(flag)
    return flag

@router.patch("/{name}", response_model=FeatureFlag)
def update_flag(name: str, enabled: bool | None = None, description: str | None = None, session: Session = Depends(get_session)):
    """Toggle or update a feature flag's attributes."""
    flag = session.get(FeatureFlag, name)
    if not flag:
        raise HTTPException(status_code=404, detail="Feature flag not found")
    if enabled is not None:
        flag.enabled = enabled
    if description is not None:
        flag.description = description
    session.add(flag)
    session.commit()
    session.refresh(flag)
    return flag
