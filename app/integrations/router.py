"""AI Service router for Alimenta platform.

This module provides backend-only endpoints for AI services.
The GEMINI_API_KEY is used exclusively by this backend - never exposed to frontend.

Frontend clients should authenticate with JWT, then call these endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from pydantic import BaseModel

from .gemini import generate_social_weighting_advice


router = APIRouter(prefix="/ai", tags=["ai-services"])


class SocialWeightingRequest(BaseModel):
    """Request model for social weighting advice."""
    context: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000


class SocialWeightingResponse(BaseModel):
    """Response model for social weighting advice."""
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None


def check_auth(authorization: Optional[str] = Header(None)):
    """Optional authentication for AI endpoints.
    
    In production, this should validate JWT tokens.
    For development, it's optional.
    """
    # In production, validate JWT token here
    # if not authorization or not authorization.startswith("Bearer "):
    #     raise HTTPException(status_code=401, detail="Unauthorized")
    return True


@router.post("/social-weighting", response_model=SocialWeightingResponse)
async def generate_social_weighting(
    request: SocialWeightingRequest,
    authenticated: bool = Depends(check_auth)
):
    """Generate social weighting advice using Gemini.
    
    This endpoint is for backend use only.
    The GEMINI_API_KEY is stored server-side and never exposed to clients.
    
    Usage:
    1. Frontend authenticates with JWT
    2. Frontend calls this endpoint with context
    3. Backend uses server-stored GEMINI_API_KEY
    """
    try:
        result = await generate_social_weighting_advice(
            context=request.context,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        return SocialWeightingResponse(success=True, data=result)
    except ValueError as e:
        return SocialWeightingResponse(
            success=False,
            error=f"Configuration error: {str(e)}"
        )
    except RuntimeError as e:
        return SocialWeightingResponse(
            success=False,
            error=f"API error: {str(e)}"
        )
    except Exception as e:
        return SocialWeightingResponse(
            success=False,
            error=f"Unexpected error: {str(e)}"
        )


@router.get("/health")
async def ai_health_check():
    """Check if AI service is configured."""
    from .gemini import get_gemini_config
    
    config = get_gemini_config()
    has_key = bool(config.api_key)
    
    return {
        "status": "ok" if has_key else "configured",
        "model": config.model,
        "api_key_configured": has_key,
        "note": "API key should be set via GEMINI_API_KEY environment variable"
    }