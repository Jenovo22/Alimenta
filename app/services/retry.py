"""Retry decorator for handling PostgreSQL deadlock scenarios."""

import functools
import time
import logging
from typing import Callable, TypeVar, Any, Optional

from psycopg2 import OperationalError, DatabaseError
from psycopg2.errorcodes import DETECTED_DEADLOCK, TUPLE_UNIQUE_VIOLATION

logger = logging.getLogger(__name__)

T = TypeVar('T')


def retry_on_deadlock(
    max_retries: int = 3,
    base_delay: float = 0.1,
    exponential_backoff: bool = True,
    retry_on_unique_violation: bool = False,
    ignored_exceptions: tuple = ()
) -> Callable[[Callable[T]], Callable[T]]:
    """Decorator to retry a function on PostgreSQL deadlock errors.

    This decorator wraps database operations with automatic retry logic
    for handling transient errors like deadlocks and constraint violations.

    Args:
        max_retries: Maximum number of retry attempts (default: 3).
        base_delay: Initial delay in seconds before first retry (default: 0.1).
        exponential_backoff: If True, delay increases exponentially with each retry.
            If False, uses constant base_delay (default: True).
        retry_on_unique_violation: If True, also retry on unique constraint violations
            (may indicate race conditions in concurrent scenarios) (default: False).
        ignored_exceptions: Tuple of exception types that should not trigger a retry.

    Returns:
        Decorated function with retry logic.

    Example:
        @retry_on_deadlock(max_retries=3, base_delay=0.2)
        def transfer_funds(session, from_account, to_account, amount):
            # Database operation that might deadlock
            ...
    """

    def decorator(func: Callable[T]) -> Callable[T]:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            last_exception = None
            delays = []

            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except ignored_exceptions:
                    raise
                except (OperationalError, DatabaseError) as e:
                    # Extract the SQLSTATE error code if available
                    sqlstate = None
                    if hasattr(e, 'pgcode'):
                        sqlstate = e.pgcode

                    # Check if this is a retryable error
                    is_deadlock = sqlstate == '40P01'  # deadlock_detected
                    is_unique_violation = (
                        retry_on_unique_violation and
                        sqlstate == '23505'  # unique_violation
                    )

                    if not (is_deadlock or is_unique_violation):
                        raise

                    last_exception = e

                    if attempt < max_retries:
                        # Calculate delay
                        if exponential_backoff:
                            delay = base_delay * (2 ** attempt)
                        else:
                            delay = base_delay

                        delays.append(delay)
                        logger.warning(
                            f"Deadlock detected in {func.__name__} "
                            f"(attempt {attempt + 1}/{max_retries + 1}). "
                            f"Retrying in {delay:.3f}s... Error: {e}"
                        )
                        time.sleep(delay)
                    else:
                        logger.error(
                            f"Max retries ({max_retries}) exceeded in {func.__name__}. "
                            f"Last error: {e}"
                        )

            # All retries exhausted
            raise last_exception

        return wrapper

    return decorator


def retry_on_error(
    exceptions: tuple,
    max_retries: int = 3,
    base_delay: float = 0.1,
    message: Optional[str] = None
) -> Callable[[Callable[T]], Callable[T]]:
    """Generic retry decorator for any specified exception types.

    Args:
        exceptions: Tuple of exception types to retry on.
        max_retries: Maximum number of retry attempts.
        base_delay: Delay in seconds between retries (exponential backoff).
        message: Optional custom error message for logging.

    Returns:
        Decorated function with retry logic.
    """

    def decorator(func: Callable[T]) -> Callable[T]:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt >= max_retries:
                        raise
                    delay = base_delay * (2 ** attempt)
                    logger.warning(
                        f"{message or 'Exception'} in {func.__name__} "
                        f"(attempt {attempt + 1}/{max_retries + 1}). "
                        f"Retrying in {delay:.3f}s... Error: {e}"
                    )
                    time.sleep(delay)

            return None  # Should never reach here

        return wrapper

    return decorator