"""Routers package for Alimenta API."""

from .users import router as users_router
from .communities import router as communities_router
from .products import router as products_router
from .donations import router as donations_router
from .inventory import router as inventory_router
from .organizations import router as organizations_router
from .volunteer_events import router as volunteer_router
from .availability import router as availability_router
from .needs import router as needs_router
from .jornadas_voluntariado import router as jornadas_router
from .admin import router as admin_router
from .auth import router as auth_router
from .agent import router as agent_router

__all__ = [
    "users_router",
    "communities_router", 
    "products_router",
    "donations_router",
    "inventory_router",
    "organizations_router",
    "volunteer_router",
    "availability_router",
    "needs_router",
    "jornadas_router",
    "admin_router",
    "auth_router",
    "agent_router",
]