"""Inventory API endpoints for managing the community food bank inventory."""

from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func

from ..database import get_donations_session
from ..models.inventory import Inventory, InventoryMovement
from ..models.product import Product

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("", response_model=List[Inventory])
def list_inventory(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_donations_session)
):
    """List all inventory items."""
    inventory_items = session.exec(select(Inventory).offset(skip).limit(limit)).all()
    return inventory_items


@router.get("/summary", response_model=dict)
def get_inventory_summary(session: Session = Depends(get_donations_session)):
    """Get a summary of inventory by product."""
    inventory_items = session.exec(select(Inventory)).all()

    summary = []
    for item in inventory_items:
        # Get product name
        product = session.get(Product, item.product_id)
        if product:
            summary.append({
                "product_id": item.product_id,
                "product_name": product.name,
                "received_quantity": item.received_quantity,
                "available_quantity": item.available_quantity,
                "reserved_quantity": item.reserved_quantity,
                "dispatched_quantity": item.dispatched_quantity,
                "total": item.received_quantity,
                "location": item.location
            })

    return {"items": summary, "total_products": len(summary)}


@router.get("/movements", response_model=List[InventoryMovement])
def list_movements(
    skip: int = 0,
    limit: int = 100,
    movement_type: Optional[str] = None,
    session: Session = Depends(get_donations_session)
):
    """List inventory movements, optionally filtered by type."""
    query = select(InventoryMovement)
    if movement_type:
        query = query.where(InventoryMovement.movement_type == movement_type)
    movements = session.exec(query.order_by(InventoryMovement.created_at.desc()).offset(skip).limit(limit)).all()
    return movements


@router.get("/{inventory_id}", response_model=Inventory)
def read_inventory(inventory_id: int, session: Session = Depends(get_donations_session)):
    """Get a specific inventory item by ID."""
    inventory_item = session.get(Inventory, inventory_id)
    if not inventory_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found")
    return inventory_item


@router.get("/by-product/{product_id}", response_model=Inventory)
def get_inventory_by_product(
    product_id: int,
    session: Session = Depends(get_donations_session)
):
    """Get inventory by product ID."""
    inventory_item = session.exec(
        select(Inventory).where(Inventory.product_id == product_id)
    ).first()
    if not inventory_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inventory item not found for this product")
    return inventory_item


@router.post("/adjust", response_model=Inventory)
def adjust_inventory(
    product_id: int,
    quantity_adjustment: int,
    movement_type: str,  # RECEIPT, DISPATCH, ADJUSTMENT
    reference_donation_id: Optional[int] = None,
    notes: Optional[str] = None,
    session: Session = Depends(get_donations_session),
    user_id: int = Depends(lambda: 1)  # Placeholder for auth
):
    """Adjust inventory (receive, dispatch, or adjust)."""
    import re

    if movement_type not in ["RECEIPT", "DISPATCH", "ADJUSTMENT"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="movement_type must be RECEIPT, DISPATCH, or ADJUSTMENT"
        )

    # Get or create inventory item
    inventory_item = session.exec(
        select(Inventory).where(Inventory.product_id == product_id)
    ).first()

    if not inventory_item:
        if movement_type != "RECEIPT":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inventory item does not exist. Use RECEIPT to create it."
            )
        inventory_item = Inventory(
            product_id=product_id,
            received_quantity=0,
            available_quantity=0,
            reserved_quantity=0,
            dispatched_quantity=0
        )
        session.add(inventory_item)
        session.flush()  # Get the ID

    # Calculate new quantities
    old_received = inventory_item.received_quantity
    old_available = inventory_item.available_quantity
    old_dispatched = inventory_item.dispatched_quantity

    if movement_type == "RECEIPT":
        inventory_item.received_quantity += quantity_adjustment
        inventory_item.available_quantity += quantity_adjustment
    elif movement_type == "DISPATCH":
        if inventory_item.available_quantity < abs(quantity_adjustment):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient available quantity. Have {inventory_item.available_quantity}, need {abs(quantity_adjustment)}"
            )
        inventory_item.dispatched_quantity += abs(quantity_adjustment)
        inventory_item.available_quantity -= abs(quantity_adjustment)
    else:  # ADJUSTMENT
        inventory_item.received_quantity += quantity_adjustment
        inventory_item.available_quantity += quantity_adjustment

    inventory_item.updated_at = datetime.utcnow()

    # Record the movement
    movement = InventoryMovement(
        inventory_id=inventory_item.id,
        movement_type=movement_type,
        quantity=quantity_adjustment if movement_type == "RECEIPT" else abs(quantity_adjustment),
        reference_donation_id=reference_donation_id,
        notes=notes,
        created_by_id=user_id
    )
    session.add(movement)
    session.add(inventory_item)
    session.commit()
    session.refresh(inventory_item)
    session.refresh(movement)

    return inventory_item
