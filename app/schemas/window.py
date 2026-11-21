from pydantic import BaseModel

class WindowSchema(BaseModel):
    """Pydantic schema for a availability window.

    The duration of the window is now configurable via the ``duration_minutes`` field.
    """
    duration_minutes: int = 60

    class Config:
        orm_mode = True
