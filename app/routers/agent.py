"""Agent service router - Gestor Logístico endpoints."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from ..database import get_donations_session
from ..services.agent import LogisticsManager, create_agent_service
from ..models.user import User

router = APIRouter(prefix="/agent", tags=["agent"])


@router.get("/analyze/pending")
def analyze_all_pending(
    limit: int = Query(100, ge=1, le=1000),
    session: Session = Depends(get_donations_session)
):
    """Analyze all pending donations and rank by priority."""
    agent = create_agent_service(session)
    results = agent.analyze_all_pending(limit=limit)
    return {
        "total": len(results),
        "analysis": results,
        "top_priorities": results[:10] if results else []
    }


@router.get("/analyze/{donation_id}")
def analyze_donation(
    donation_id: int,
    session: Session = Depends(get_donations_session)
):
    """Analyze a single donation with weighted scoring."""
    agent = create_agent_service(session)
    try:
        result = agent.analyze_donation(donation_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/allocate/{product_id}")
def allocate_inventory(
    product_id: int,
    quantity: int = Query(..., ge=1),
    exclude_communities: Optional[List[int]] = Query(None),
    session: Session = Depends(get_donations_session)
):
    """Recommend inventory allocation based on community needs."""
    from ..models.product import Product
    
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    agent = create_agent_service(session)
    allocations = agent.allocate_inventory(
        product_id=product_id,
        quantity=quantity,
        exclude_community_ids=exclude_communities
    )
    
    return {
        "product_id": product_id,
        "product_name": product.name,
        "total_quantity": quantity,
        "allocations": allocations,
        "remaining_unallocated": quantity - sum(a["allocated_quantity"] for a in allocations)
    }


@router.put("/weights")
def update_weights(
    weights: dict,
    session: Session = Depends(get_donations_session)
):
    """Update agent decision weights. Admin only."""
    valid_keys = ["equity", "urgency", "efficiency", "impact"]
    
    # Validate weights
    for key in weights:
        if key not in valid_keys:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid weight key: {key}. Valid: {valid_keys}"
            )
        val = weights[key]
        if not (0 <= val <= 1):
            raise HTTPException(
                status_code=400,
                detail=f"Weight '{key}' must be between 0 and 1"
            )
    
    # In production, persist these to feature_flags or config table
    # For now, return the updated weights
    total = sum(weights.values())
    if total != 1.0 and abs(total - 1.0) > 0.01:
        # Normalize if not exactly 1.0
        normalized = {k: v / total for k, v in weights.items()}
        return {"weights": normalized, "note": "Weights normalized to sum to 1.0"}
    
    return {"weights": weights}


@router.get("/weights")
def get_weights():
    """Get current agent decision weights."""
    return {"weights": LogisticsManager.DEFAULT_WEIGHTS}
