"""Placeholder router for the 'jornadas_voluntariado' module."""

from fastapi import APIRouter

router = APIRouter(prefix="/jornadas", tags=["jornadas_voluntariado"])

@router.get("/example")
async def example_endpoint():
    return {"message": "Jornadas Voluntariado endpoint active"}
