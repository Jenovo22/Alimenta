"""Utilities for accessing feature flags within FastAPI routes."""

from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select
from .models.feature_flag import FeatureFlag
from .database import get_session

def is_feature_enabled(name: str, session: Session = Depends(get_session)) -> bool:
    """Return True if the named feature flag is enabled.

    Raises:
        HTTPException 404 if the flag does not exist.
    """
    flag = session.get(FeatureFlag, name)
    if flag is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature flag '{name}' not found",
        )
    return flag.enabled

def require_feature(name: str):
    """Dependency factory that ensures a feature flag is enabled.

    Usage::
        @app.get("/some-endpoint", dependencies=[Depends(require_feature("my_feature"))])
    """
    async def dependency(enabled: bool = Depends(lambda session=Depends(get_session): is_feature_enabled(name, session))):
        if not enabled:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Feature '{name}' is disabled",
            )
    return dependency
