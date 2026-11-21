"""Community API endpoints for managing communities."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_donations_session
from ..models.community import Community, EdilCommunityLink
from ..models.user import User

router = APIRouter(prefix="/communities", tags=["communities"])


@router.get("", response_model=List[Community])
def list_communities(
    skip: int = 0,
    limit: int = 100,
    only_verified: bool = True,
    session: Session = Depends(get_donations_session)
):
    """List all communities, optionally only verified ones."""
    query = select(Community)
    if only_verified:
        query = query.where(Community.is_verified == True)
    communities = session.exec(query.offset(skip).limit(limit)).all()
    return communities


@router.get("/{community_id}", response_model=Community)
def read_community(community_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific community by ID."""
    community = session.get(Community, community_id)
    if not community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return community


@router.post("", response_model=Community, status_code=status.HTTP_201_CREATED)
def create_community(
    name: str,
    description: Optional[str] = None,
    code: Optional[str] = None,
    session: Session = Depends(get_donations_session)
):
    """Create a new community."""
    community = Community(
        name=name,
        description=description,
        code=code,
        is_verified=False
    )
    session.add(community)
    session.commit()
    session.refresh(community)
    return community


@router.patch("/{community_id}/verify", response_model=Community)
def verify_community(
    community_id: int,
    is_verified: bool = True,
    session: Session = Depends(get_donations_session)
):
    """Verify or unverify a community."""
    community = session.get(Community, community_id)
    if not community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")

    community.is_verified = is_verified
    community.updated_at = datetime.utcnow()
    session.add(community)
    session.commit()
    session.refresh(community)
    return community


@router.get("/{community_id}/ediles", response_model=List[User])
def get_community_ediles(
    community_id: int,
    session: Session = Depends(get_donations_session)
):
    """Get all ediles for a community."""
    # First check community exists
    community = session.get(Community, community_id)
    if not community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")

    # Get edil-community links
    links = session.exec(
        select(EdilCommunityLink).where(EdilCommunityLink.community_id == community_id)
    ).all()

    if not links:
        return []

    edil_ids = [link.edil_id for link in links]
    ediles = session.exec(
        select(User).where(User.id.in_(edil_ids))
    ).all()

    return ediles