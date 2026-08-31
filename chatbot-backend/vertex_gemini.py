"""
Chat completion via Vertex AI, with the caller falling back to the Gemini
Developer API (google.generativeai + GOOGLE_API_KEY) on any failure.

Mirrors the auth/request pattern already proven in the veranoprado project's
app/gemini_chat.py - service-account OAuth token, raw REST call to Vertex's
:generateContent endpoint. Kept deliberately simpler here: no tool/function
calling, no image handling - this bot only does knowledge-base-grounded
text chat.
"""
import base64
import json
import logging
from typing import Any, Dict, List, Optional, Tuple

import requests

from config import get_settings

logger = logging.getLogger(__name__)

DEFAULT_TIMEOUT = 30
# 2.5+ series models spend output budget on internal "thinking" before the
# visible answer, billed against maxOutputTokens - a ceiling sized only for
# the visible reply can cut the response off with zero text (learned the
# hard way in veranoprado's Vertex integration).
MAX_OUTPUT_TOKENS = 8192


def is_configured() -> bool:
    return bool(get_settings().GOOGLE_VERTEX_CREDENTIALS_B64)


def _access_token() -> Tuple[Optional[str], Optional[str]]:
    """Bearer token + project id from the service account."""
    settings = get_settings()
    if not settings.GOOGLE_VERTEX_CREDENTIALS_B64:
        return None, None
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request as GoogleAuthRequest

        info = json.loads(base64.b64decode(settings.GOOGLE_VERTEX_CREDENTIALS_B64))
        creds = service_account.Credentials.from_service_account_info(
            info, scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
        creds.refresh(GoogleAuthRequest())
        return creds.token, settings.VERTEX_PROJECT_ID or info.get("project_id")
    except Exception as exc:
        logger.warning(f"[vertex] could not obtain credentials: {exc}")
        return None, None


def _endpoint(model: str, project_id: str) -> str:
    settings = get_settings()
    location = settings.VERTEX_LOCATION or "global"
    host = (
        "aiplatform.googleapis.com"
        if location == "global"
        else f"{location}-aiplatform.googleapis.com"
    )
    return (
        f"https://{host}/v1/projects/{project_id}/locations/{location}"
        f"/publishers/google/models/{model}:generateContent"
    )


def _to_contents(history: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    """Turn our simple [{role, content}] history into Vertex `contents`."""
    contents = []
    for msg in history:
        role = "model" if msg["role"] in ("assistant", "model") else "user"
        contents.append({"role": role, "parts": [{"text": msg["content"]}]})
    return contents


def generate(model: str, history: List[Dict[str, str]], user_message: str) -> Optional[str]:
    """Run one turn via Vertex. Returns the text reply, or None on any
    failure - the caller is expected to fall back to the Gemini Developer
    API in that case."""
    token, project_id = _access_token()
    if not token or not project_id:
        return None

    contents = _to_contents(history) + [{"role": "user", "parts": [{"text": user_message}]}]
    url = _endpoint(model, project_id)
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    body = {
        "contents": contents,
        "generationConfig": {"maxOutputTokens": MAX_OUTPUT_TOKENS, "temperature": 0.7},
    }

    try:
        resp = requests.post(url, headers=headers, json=body, timeout=DEFAULT_TIMEOUT)
        if not resp.ok:
            logger.warning(f"[vertex] HTTP {resp.status_code}: {resp.text[:300]}")
            return None
        data = resp.json()
        candidates = data.get("candidates") or []
        if not candidates:
            return None
        parts = (candidates[0].get("content") or {}).get("parts") or []
        text = "".join(p["text"] for p in parts if p.get("text"))
        return text or None
    except Exception as exc:
        logger.warning(f"[vertex] request failed: {exc}")
        return None
