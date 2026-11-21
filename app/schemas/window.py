from pydantic import BaseModel, ConfigDict


class WindowSchema(BaseModel):
    """Pydantic schema for a availability window.

    The duration of the window is now configurable via the ``duration_minutes`` field.
    """
    model_config = ConfigDict(from_attributes=True)
    
    duration_minutes: int = 60
