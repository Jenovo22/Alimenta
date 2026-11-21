"""Token schemas for authentication responses."""

from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
    refresh_token: Optional[str] = None


class TokenPayload(BaseModel):
    sub: Optional[int] = None
    role: Optional[str] = None
    exp: Optional[int] = None