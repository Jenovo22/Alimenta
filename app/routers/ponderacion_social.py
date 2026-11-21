"""Placeholder router for the 'ponderacion_social' module."""

from fastapi import APIRouter

router = APIRouter(prefix="/ponderacion", tags=["ponderacion_social"])

@router.get("/example")
async def example_endpoint():
    return {"message": "Ponderacion Social endpoint active"}
