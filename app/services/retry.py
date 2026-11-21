"""Retry decorator for handling database errors (SQLite/SQLModel compatible)."""

import functools
import time
import logging
from typing import TypeVar, Any, Optional, Callable, overload

try:
    from psycopg2 import OperationalError as Psycopg2OperationalError, DatabaseError as Psycopg2DatabaseError
    HAS_PSYCOPG2 = True
except ImportError:
    HAS_PSYCOPG2 = False

from sqlalchemy import exc as sqlalchemy_exc

logger = logging.getLogger(__name__)

T = TypeVar('T')


def _is_deadlock_error(e: Exception) -> bool:
    """Check if the error is a retryable deadlock-like error."""
    if HAS_PSYCOPG2:
        if isinstance(e, (Psycopg2OperationalError, Psycopg2DatabaseError)):
            sqlstate = getattr(e, 'pgcode', None)
            if sqlstate == '40P01' or sqlstate == '23505':
                return True
    # SQLAlchemy/SQLite errors that might be retryable
    if isinstance(e, sqlalchemy_exc.OperationalError):
        return True
    return False


def retry_on_deadlock(
    func: Optional[Callable] = None,
    *,
    max_retries: int = 3,
    base_delay: float = 0.1,
    exponential_backoff: bool = True,
    retry_on_unique_violation: bool = False,
    ignored_exceptions: tuple = ()
) -> Callable:
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

    def decorator(f: Callable) -> Callable:
        @functools.wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            last_exception = None

            for attempt in range(max_retries + 1):
                try:
                    return f(*args, **kwargs)
                except ignored_exceptions:
                    raise
                except Exception as e:
                    # Extract the SQLSTATE error code if available
                    sqlstate = None
                    if hasattr(e, 'pgcode'):
                        sqlstate = e.pgcode

                    # Check if this is a retryable error
                    is_deadlock = _is_deadlock_error(e)
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

                        logger.warning(
                            f"Deadlock detected in {f.__name__} "
                            f"(attempt {attempt + 1}/{max_retries + 1}). "
                            f"Retrying in {delay:.3f}s... Error: {e}"
                        )
                        time.sleep(delay)
                    else:
                        logger.error(
                            f"Max retries ({max_retries}) exceeded in {f.__name__}. "
                            f"Last error: {e}"
                        )

            # All retries exhausted
            raise last_exception

        return wrapper

    # Support both @retry_on_deadlock and @retry_on_deadlock(...)
    if func is not None:
        return decorator(func)
    return decorator


def retry_on_error(
    exceptions: tuple,
    max_retries: int = 3,
    base_delay: float = 0.1,
    message: Optional[str] = None
) -> Callable:
    """Generic retry decorator for any specified exception types.
    
    Args:
        exceptions: Tuple of exception types to retry on.
        max_retries: Maximum number of retry attempts.
        base_delay: Delay in seconds between retries (exponential backoff).
        message: Optional custom error message for logging.

    Returns:
        Decorated function with retry logic.
    """

    def decorator(f: Callable) -> Callable:
        @functools.wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            for attempt in range(max_retries + 1):
                try:
                    return f(*args, **kwargs)
                except exceptions as e:
                    if attempt >= max_retries:
                        raise
                    delay = base_delay * (2 ** attempt)
                    logger.warning(
                        f"{message or 'Exception'} in {f.__name__} "
                        f"(attempt {attempt + 1}/{max_retries + 1}). "
                        f"Retrying in {delay:.3f}s... Error: {e}"
                    )
                    time.sleep(delay)

            return None  # Should never reach here

        return wrapper

    return decorator