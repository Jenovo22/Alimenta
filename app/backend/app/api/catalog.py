import os
import json
from functools import wraps
from typing import Callable, Any

import redis
from fastapi import APIRouter, Request, HTTPException, status

router = APIRouter()

# Redis client configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_client = redis.Redis.from_url(REDIS_URL)

# Default TTL (seconds) – can be overridden via .env variable CACHE_TTL
DEFAULT_TTL = int(os.getenv("CACHE_TTL", "3600"))

def _make_cache_key(request: Request) -> str:
    """Create a deterministic cache key based on request path and query string."""
    path = request.url.path
    query = request.url.query
    key = f"cache:{path}"
    if query:
        key += f"?{query}"
    return key

def redis_cache(ttl: int = DEFAULT_TTL):
    """Decorator to cache GET endpoint responses in Redis.

    The wrapped function must accept a ``Request`` object as its first argument
    and return a JSON‑serialisable value. The response is cached for ``ttl``
    seconds. Subsequent calls return the cached payload without executing the
    wrapped handler.
    """
    def decorator(func: Callable[[Request, Any], Any]):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            cache_key = _make_cache_key(request)
            cached = redis_client.get(cache_key)
            if cached is not None:
                # Return the cached JSON payload directly
                return json.loads(cached)
            # Compute fresh response
            response = await func(request, *args, **kwargs)
            # Store in Redis (serialize to JSON string)
            try:
                redis_client.setex(cache_key, ttl, json.dumps(response))
            except Exception:
                # If Redis is unavailable we silently ignore caching errors
                pass
            return response
        return wrapper
    return decorator

# ----- READ ENDPOINTS (cached) -----
@router.get("/catalog", tags=["catalog"])
@redis_cache()
async def get_catalog(request: Request):
    """Return catalog data.

    In a real implementation this would query a database or external service.
    Here we return a placeholder payload.
    """
    # Placeholder data – replace with actual business logic
    return {"items": ["item1", "item2", "item3"]}

@router.get("/catalog/{item_id}", tags=["catalog"])
@redis_cache()
async def get_catalog_item(request: Request, item_id: str):
    """Return a single catalog item by ID."""
    # Placeholder – simulate lookup
    return {"id": item_id, "name": f"Item {item_id}"}

# ----- WRITE ENDPOINTS (invalidate cache) -----
def _invalidate_cache(prefix: str = "/catalog"):
    """Remove all cached keys that start with the given prefix.

    FastAPI routes use the same ``_make_cache_key`` format, so we delete any
    key that begins with ``cache:{prefix}``.
    """
    pattern = f"cache:{prefix}*"
    try:
        for key in redis_client.scan_iter(match=pattern):
            redis_client.delete(key)
    except Exception:
        # Silently ignore Redis errors – the write operation must still succeed
        pass

@router.post("/catalog", status_code=status.HTTP_201_CREATED, tags=["catalog"])
async def create_catalog_item(request: Request, payload: dict):
    """Create a new catalog item.

    After creation we invalidate any cached catalog reads.
    """
    # TODO: Insert payload into persistence layer
    _invalidate_cache()
    return {"message": "Item created", "item": payload}

@router.put("/catalog/{item_id}", tags=["catalog"])
async def update_catalog_item(request: Request, item_id: str, payload: dict):
    """Update an existing catalog item and invalidate cache."""
    # TODO: Update persistence layer
    _invalidate_cache()
    return {"message": f"Item {item_id} updated", "item": payload}

@router.delete("/catalog/{item_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["catalog"])
async def delete_catalog_item(request: Request, item_id: str):
    """Delete a catalog item and invalidate cache."""
    # TODO: Delete from persistence layer
    _invalidate_cache()
    return None
