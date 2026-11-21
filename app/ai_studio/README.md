# Módulo Google AI Studio (`app/ai_studio/`)

Esta carpeta está dedicada exclusivamente a la integración del modelo de IA (Google AI Studio / Gemini) que asiste la **ponderación social**, el **reparto parcial sugerido (`US8494885B2`)** y el **emparejamiento asistido** en Alimenta bajo el principio *Human-in-the-Loop*.

## Archivos

- [`system_instructions.md`](system_instructions.md): Instrucciones del sistema que consume el modelo, construidas a partir del contexto y reglas del repositorio (`Human-in-the-Loop`, privacidad `R11`, exclusiones `R12`, Catálogo UNAL, jornadas de voluntariado y datos territoriales agregados de Manizales).
- [`gemini_client.py`](gemini_client.py): Cliente Python sin dependencias externas que lee `GEMINI_API_KEY` desde el entorno del servidor (usando el header `x-goog-api-key`) y solicita respuesta JSON estructurada.

## Manejo seguro de la API Key

1. **Solo en el backend:** El frontend (`app/frontend/`) **nunca** debe contener ni enviar la `GEMINI_API_KEY`. Toda petición pasa por el backend FastAPI (`app/main.py`).
2. **Local:** Copia `.env.example` a `.env` (ignorado por Git) y define `GEMINI_API_KEY=tu_clave`.
3. **Producción / cualquier entorno:** Configura `GEMINI_API_KEY` como variable secreta en tu plataforma de despliegue (Railway, Render, Fly.io, AWS/GCP Secret Manager o Docker Compose con `env_file`) y restringe la clave en Google AI Studio / Google Cloud a *Generative Language API* y, si aplica, a la IP del servidor.
