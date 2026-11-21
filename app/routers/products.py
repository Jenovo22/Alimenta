"""Product API endpoints for managing products and categories."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..database import get_donations_session
from ..models.product_category import ProductCategory
from ..models.product import Product

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/categories", response_model=List[ProductCategory])
def list_categories(
    skip: int = 0,
    limit: int = 100,
    only_active: bool = True,
    session: Session = Depends(get_donations_session)
):
    """List all product categories, optionally only active ones."""
    query = select(ProductCategory)
    if only_active:
        query = query.where(ProductCategory.is_active == True)
    categories = session.exec(query.order_by(ProductCategory.sort_order).offset(skip).limit(limit)).all()
    return categories


@router.get("/categories/{category_id}", response_model=ProductCategory)
def read_category(category_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific product category by ID."""
    category = session.get(ProductCategory, category_id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


@router.get("", response_model=List[Product])
def list_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    only_active: bool = True,
    session: Session = Depends(get_donations_session)
):
    """List all products, optionally filtered by category."""
    query = select(Product)
    if only_active:
        query = query.where(Product.is_active == True)
    if category_id:
        query = query.where(Product.category_id == category_id)
    products = session.exec(query.order_by(Product.sort_order).offset(skip).limit(limit)).all()
    return products


@router.get("/categories/{category_id}/products", response_model=List[Product])
def get_category_products(
    category_id: int,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_donations_session)
):
    """Get all products in a category."""
    products = session.exec(
        select(Product).where(Product.category_id == category_id).offset(skip).limit(limit)
    ).all()
    return products