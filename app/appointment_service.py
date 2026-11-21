"""Placeholder appointment service with event broadcasting.
This module demonstrates how state‑change functions can emit real‑time
notifications via the WebSocket manager defined in ``app.notifications``.
In a full implementation the functions would interact with a database
and contain business logic; here they simply broadcast the corresponding
event.
"""

from typing import Dict, Any

from .notifications import send_event


async def accept_appointment(appointment_id: str, user_id: str) -> None:
    """Mark an appointment as accepted and notify clients.

    Args:
        appointment_id: Identifier of the appointment.
        user_id: Identifier of the user who accepted the appointment.
    """
    # TODO: Persist state change (e.g., update DB)
    await send_event("appointment_accepted", {"appointment_id": appointment_id, "user_id": user_id})


async def reject_appointment(appointment_id: str, reason: str | None = None) -> None:
    """Mark an appointment as rejected and notify clients.

    Args:
        appointment_id: Identifier of the appointment.
        reason: Optional reason for rejection.
    """
    # TODO: Persist state change
    payload: Dict[str, Any] = {"appointment_id": appointment_id}
    if reason:
        payload["reason"] = reason
    await send_event("appointment_rejected", payload)


async def priority_alert(appointment_id: str, level: int) -> None:
    """Send a priority alert for an appointment.

    Args:
        appointment_id: Identifier of the appointment.
        level: Priority level (higher means more urgent).
    """
    # TODO: Possibly update appointment priority in storage
    await send_event("priority_alert", {"appointment_id": appointment_id, "level": level})
