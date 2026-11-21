import os
import httpx
from typing import Optional

# Load configuration from environment (e.g., via python-dotenv in the main app)
EMAIL_API_KEY: str = os.getenv("EMAIL_API_KEY", "")
EMAIL_FROM: str = os.getenv("EMAIL_FROM", "no-reply@example.com")

# Choose provider: SendGrid or Mailgun based on available env vars
USE_SENDGRID = bool(os.getenv("SENDGRID_API_KEY"))
USE_MAILGUN = bool(os.getenv("MAILGUN_API_KEY"))

# Helper to send via SendGrid
async def _send_via_sendgrid(to: str, subject: str, body: str) -> None:
    api_key = os.getenv("SENDGRID_API_KEY")
    if not api_key:
        raise RuntimeError("SENDGRID_API_KEY not set")
    payload = {
        "personalizations": [{"to": [{"email": to}]}],
        "from": {"email": EMAIL_FROM},
        "subject": subject,
        "content": [{"type": "text/plain", "value": body}],
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.sendgrid.com/v3/mail/send",
            json=payload,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10.0,
        )
        resp.raise_for_status()

# Helper to send via Mailgun
async def _send_via_mailgun(to: str, subject: str, body: str) -> None:
    api_key = os.getenv("MAILGUN_API_KEY")
    domain = os.getenv("MAILGUN_DOMAIN")
    if not api_key or not domain:
        raise RuntimeError("MAILGUN_API_KEY or MAILGUN_DOMAIN not set")
    data = {
        "from": EMAIL_FROM,
        "to": to,
        "subject": subject,
        "text": body,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"https://api.mailgun.net/v3/{domain}/messages",
            data=data,
            auth=("api", api_key),
            timeout=10.0,
        )
        resp.raise_for_status()

# Public async function
async def send_email(to: str, subject: str, body: str) -> None:
    """Send an email using the configured provider.

    The function automatically picks SendGrid if ``SENDGRID_API_KEY`` is set,
    otherwise falls back to Mailgun when ``MAILGUN_API_KEY`` and ``MAILGUN_DOMAIN``
    are present. Raises ``RuntimeError`` if no provider is configured.
    """
    if USE_SENDGRID:
        await _send_via_sendgrid(to, subject, body)
    elif USE_MAILGUN:
        await _send_via_mailgun(to, subject, body)
    else:
        raise RuntimeError("No email provider configured. Set SENDGRID_API_KEY or MAILGUN_API_KEY.")
