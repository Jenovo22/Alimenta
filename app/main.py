from fastapi import FastAPI, Response, Header, Depends, HTTPException
import os
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST, Depends
from sqlmodel import select

from .database import init_db, get_session, engine
from .models.feature_flag import FeatureFlag
from .routers import admin
from .routers import ponderacion_social, jornadas_voluntariado
from .feature_flags import is_feature_enabled
from strawberry.fastapi import GraphQLRouter
from .graphql import schema

app = FastAPI(
    title="Alimenta Backend API",
    description="""
    **Plataforma de coordinación de donaciones y servicios comunitarios.**

    API para gestionar:
    - Citas de donación (appointments)
    - Ventanas de disponibilidad
    - Jornadas de voluntariado
    - Inventario y donaciones
    - Gestión de usuarios y roles
    - Auditoría y feature flags

    ## Autenticación

    La API soporta autenticación mediante JWT. Los endpoints que requieren autorización deben incluir el header:
    `Authorization: Bearer <token>`

    ## Documentación

    - **Swagger UI**: [`/docs`](/docs) - Interfaz interactiva para probar endpoints
    - **ReDoc**: [`/redoc`](/redoc) - Documentación estática detallada
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Prometheus metrics
appointments_total = Counter('appointments_total', 'Total number of appointments')
reservations_conflict = Counter('reservations_conflict', 'Number of reservation conflicts')
partial_deliveries = Counter('partial_deliveries', 'Number of partial deliveries')
confirmation_latency_seconds = Histogram('confirmation_latency_seconds', 'Latency of confirmations in seconds')

# Include catalog routes
from .backend.app.api.catalog import router as catalog_router
app.include_router(catalog_router, prefix="/api")

# Include notification routes
from app.notifications import router as notifications_router
app.include_router(notifications_router)

# Include appointment routes (backend-corrections-04)
from app.api.appointments import router as appointments_router
app.include_router(appointments_router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

# Optional auth for docs - reads from ALIMENTA_BETA_TOKEN if set
def check_optional_auth(authorization: str = Header(None, alias="Authorization")):
    """Optional authentication for documentation endpoints.
    
    If ALIMENTA_BETA_TOKEN is set, the token must be valid.
    If not set, no authentication is required.
    """
    expected = os.getenv("ALIMENTA_BETA_TOKEN")
    if not expected:
        return True  # No auth required in development
    if authorization != f"Bearer {expected}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@app.get("/redoc", include_in_schema=False)
def redoc_html(authenticated: bool = Depends(check_optional_auth)):
    """Serve ReDoc HTML with optional authentication."""
    from fastapi.openapi.docs import get_redoc_html
    return get_redoc_html(openapi_url="/openapi.json", title="Alimenta API - ReDoc")

# Simple token auth for metrics endpoint
def verify_token(authorization: str = Header(..., alias="Authorization")):
    expected = os.getenv("PROMETHEUS_TOKEN")
    if not expected or authorization != f"Bearer {expected}":
        raise HTTPException(status_code=401, detail="Unauthorized")

@app.get("/metrics")
def metrics(token: None = Depends(verify_token)):
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)
