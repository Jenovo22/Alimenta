"""Cliente ligero para consumir Google AI Studio (Gemini) desde el backend de Alimenta.

Lee la API Key exclusivamente desde variables de entorno (`GEMINI_API_KEY` o
`GOOGLE_AI_STUDIO_API_KEY`) y carga las instrucciones de sistema locales desde
`system_instructions.md`. Nunca expone credenciales en el frontend ni en Git.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

INSTRUCTIONS_PATH = Path(__file__).with_name("system_instructions.md")
DEFAULT_MODEL = "gemini-2.5-flash"
API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


class GeminiConfigError(RuntimeError):
    """Se lanza cuando falta la API Key o no es válida la configuración."""


def load_system_instructions() -> str:
    """Carga las instrucciones del sistema desde `system_instructions.md`."""
    return INSTRUCTIONS_PATH.read_text(encoding="utf-8")


def get_api_key() -> str:
    """Obtiene la API Key desde variables de entorno del servidor."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_AI_STUDIO_API_KEY")
    if not api_key:
        raise GeminiConfigError(
            "Falta GEMINI_API_KEY (o GOOGLE_AI_STUDIO_API_KEY) en el entorno del servidor."
        )
    return api_key.strip()


def generate_social_weighting_advice(
    payload: dict[str, Any],
    *,
    model: str | None = None,
    timeout: float = 30.0,
) -> dict[str, Any]:
    """Envía el contexto estructurado al modelo Gemini en Google AI Studio."""
    api_key = get_api_key()
    chosen_model = (model or os.getenv("GEMINI_MODEL") or DEFAULT_MODEL).strip()
    url = f"{API_BASE}/{chosen_model}:generateContent"

    body = {
        "system_instruction": {"parts": [{"text": load_system_instructions()}]},
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": (
                            "Analiza el siguiente estado operativo y responde únicamente con el "
                            "JSON estructurado definido en tus instrucciones:\n\n"
                            + json.dumps(payload, ensure_ascii=False, indent=2)
                        )
                    }
                ],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "responseMimeType": "application/json",
        },
    }

    request = Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=timeout) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Error HTTP {exc.code} de Google AI Studio: {detail}") from exc
    except URLError as exc:
        raise RuntimeError(f"Error de red al conectar con Google AI Studio: {exc}") from exc

    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    return json.loads(text)
