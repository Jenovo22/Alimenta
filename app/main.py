from fastapi import FastAPI, Response, Header, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
import os
from sqlmodel import select

from .database import init_db, init_donations_db, get_session, get_donations_session, engine, donations_engine
from .models.feature_flag import FeatureFlag
from .models import (
    User, Community, ProductCategory, Product, Donation,
    VolunteerEvent, AvailabilityWindow, Inventory, Organization, Need
)

from .routers.donations import router as donations_router
from .routers.needs import router as needs_router
from .routers.users import router as users_router
from .routers.communities import router as communities_router
from .routers.products import router as products_router
from .routers.inventory import router as inventory_router
from .routers.organizations import router as organizations_router
from .routers.volunteer_events import router as volunteer_router
from .routers.availability import router as availability_router
from .routers.jornadas_voluntariado import router as jornadas_router
from .routers.admin import router as admin_router
from .routers.auth import router as auth_router
from .routers.agent import router as agent_router
from .integrations.router import router as ai_router

app = FastAPI(
    title="Alimenta Backend API",
    description="""
    **Plataforma de coordinación de donaciones y servicios comunitarios.**
    
    ## Autenticación
    
    Usa `POST /api/auth/login` para obtener un token JWT.
    Incluye el header: `Authorization: Bearer <token>`
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Initialize databases
init_db()
init_donations_db()

# Health check endpoint (must be defined before the catch-all route)
@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

# Include all API routes under /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
app.include_router(donations_router, prefix="/api")
app.include_router(needs_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(communities_router, prefix="/api")
app.include_router(products_router, prefix="/api")
app.include_router(inventory_router, prefix="/api")
app.include_router(organizations_router, prefix="/api")
app.include_router(volunteer_router, prefix="/api")
app.include_router(availability_router, prefix="/api")
app.include_router(jornadas_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(ai_router, prefix="/api")

# Mount Static Files (Frontend)
frontend_path = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json", "health"]:
            return None
        
        file_path = os.path.join(frontend_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        
        return FileResponse(os.path.join(frontend_path, "index.html"))
