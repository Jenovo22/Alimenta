"""Organization API endpoints for managing allied organizations."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_donations_session
from ..models.organization import Organization

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.get("", response_model=List[Organization])
def list_organizations(
    skip: int = 0,
    limit: int = 100,
    only_verified: bool = True,
    session: Session = Depends(get_donations_session)
):
    """List all organizations, optionally only verified ones."""
    query = select(Organization)
    if only_verified:
        query = query.where(Organization.is_verified == True)
    organizations = session.exec(query.order_by(Organization.rank_position).offset(skip).limit(limit)).all()
    return organizations


@router.get("/top10", response_model=List[Organization])
def get_top_organizations(
    session: Session = Depends(get_donations_session)
):
    """Get the top 10 allied organizations."""
    organizations = session.exec(
        select(Organization).where(Organization.is_verified == True).order_by(Organization.rank_position).limit(10)
    ).all()
    return organizations


@router.get("/{organization_id}", response_model=Organization)
def read_organization(organization_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific organization by ID."""
    organization = session.get(Organization, organization_id)
    if not organization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return organization


@router.post("", response_model=Organization, status_code=status.HTTP_201_CREATED)
def create_organization(
    name: str,
    description: Optional[str] = None,
    logo_url: Optional[str] = None,
    website_url: Optional[str] = None,
    rank_position: Optional[int] = None,
    is_verified: bool = False,
    session: Session = Depends(get_donations_session)
):
    """Create a new organization."""
    organization = Organization(
        name=name,
        description=description,
        logo_url=logo_url,
        website_url=website_url,
        rank_position=rank_position,
        is_verified=is_verified
    )
    session.add(organization)
    session.commit()
    session.refresh(organization)
    return organization


@router.patch("/{organization_id}", response_model=Organization)
def update_organization(
    organization_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    logo_url: Optional[str] = None,
    website_url: Optional[str] = None,
    rank_position: Optional[int] = None,
    is_verified: Optional[bool] = None,
    session: Session = Depends(get_donations_session)
):
    """Update an organization."""
    organization = session.get(Organization, organization_id)
    if not organization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")

    if name is not None:
        organization.name = name
    if description is not None:
        organization.description = description
    if logo_url is not None:
        organization.logo_url = logo_url
    if website_url is not None:
        organization.website_url = website_url
    if rank_position is not None:
        organization.rank_position = rank_position
    if is_verified is not None:
        organization.is_verified = is_verified

    organization.updated_at = datetime.utcnow()
    session.add(organization)
    session.commit()
    session.refresh(organization)
    return organization


@router.delete("/{organization_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(
    organization_id: int,
    session: Session = Depends(get_donations_session)
):
    """Delete an organization."""
    organization = session.get(Organization, organization_id)
    if not organization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")

    session.delete(organization)
    session.commit()
    return None