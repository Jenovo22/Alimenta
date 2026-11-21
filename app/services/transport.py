"""Service utilities for handling transport validation.

This module centralises the business rule that separates the concepts of
*donante aportante* (the donor who provides the goods) and *donante
transportador* (the donor who also undertakes the transport).  The FastAPI
endpoints that create or update a transport operation should call
`validate_transport` before persisting the data.
"""

from fastapi import HTTPException, status
from typing import Optional, Dict


def validate_transport(
    donor_id: int,
    transportador_id: Optional[int],
    user_roles: Dict[int, str],
) -> None:
    """Validate transport role relationships.

    Args:
        donor_id: Identifier of the *donante aportante*.
        transportador_id: Identifier supplied for the *donante transportador*.
            May be ``None`` (in which case the donor acts as the transportador).
        user_roles: Mapping of user identifiers to their role string. Expected
            role values include ``"donante"`` and ``"donante_transportador"``.

    Raises:
        HTTPException: If the ``transportador_id`` is provided and does not
            correspond to a user with the ``donante_transportador`` role, or if
            the identifier does not exist in ``user_roles``.
    """
    # If no explicit transportador is supplied, the donor is the transportador.
    if transportador_id is None:
        return

    # Verify the transportador exists.
    role = user_roles.get(transportador_id)
    if role is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="transportador_id does not correspond to a known user.",
        )

    # Enforce the required role.
    if role != "donante_transportador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User assigned as transportador must have role 'donante_transportador'.",
        )

    # The transportador may be the same as the donor; this is allowed.
    # No further checks are required here.
    return
