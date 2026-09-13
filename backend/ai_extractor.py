"""
VeraFi AI Vision Ledger Extractor
---------------------------------
Sends physical ledger photos to Google Gemini Vision to extract
structured transactions (merchant name, dates, names, jama/udhar, amounts, balances).
"""

import json
import logging
from typing import Dict, Any, Optional

import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _get_gemini_client():
    """Initializes Google GenAI client supporting both API keys and OAuth tokens."""
    token = config.GEMINI_API_KEY.strip()
    if not token:
        raise ValueError(
            "GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in backend/.env"
        )
    from google import genai

    # Check if token is an OAuth access token (starts with AQ. or ya29.)
    if token.startswith("AQ.") or token.startswith("ya29."):
        import google.oauth2.credentials
        creds = google.oauth2.credentials.Credentials(token)
        return genai.Client(credentials=creds)

    return genai.Client(api_key=token)


def _resolve_model_name(client) -> str:
    """
    Auto-detects the most suitable vision model for the configured API key.
    Prioritizes Gemini Flash models.
    """
    try:
        models = list(client.models.list())
        model_names = [m.name for m in models]
        
        # Look for flash models
        flash_candidates = [
            m for m in model_names
            if "flash" in m.lower() and "embed" not in m.lower()
        ]
        if flash_candidates:
            selected = flash_candidates[0]
            logger.info(f"Auto-selected Gemini Vision model: {selected}")
            return selected
            
        if model_names:
            logger.info(f"Falling back to first available model: {model_names[0]}")
            return model_names[0]
    except Exception as e:
        logger.warning(f"Could not query models.list(): {e}. Using default.")

    return config.GEMINI_MODEL


EXTRACTION_PROMPT = """
You are an expert financial auditor and OCR engine for informal Indian microfinance.
Analyze the attached photo of a handwritten shopkeeper's notebook (Khatabook / Bahi-Khata / Cash Memo Receipt).

Extract every single transaction recorded on the page into this exact JSON structure:
{
  "merchant_name": "<detected store name or merchant name, e.g. 'Gupta General Store'>",
  "business_type": "<e.g. 'Grocery & Daily Essentials', 'Tea & Snacks', 'Dairy Farm'>",
  "location": "<city, market, or locality if visible, else 'Local Market'>",
  "period": "<month and year or date range if visible, e.g. 'August 2026'>",
  "currency": "INR",
  "transactions": [
    {
      "id": "tx_1",
      "date": "YYYY-MM-DD",
      "customer_name": "<name of customer, supplier, or entry description>",
      "type": "jama",
      "amount": 2500.0,
      "balance": 2500.0,
      "category": "sales",
      "note": "<items bought or remarks written>"
    }
  ]
}

CRITICAL RULES:
1. "type": Must be either "jama" (credit/inflow/money received/deposit) or "udhar" (debit/outflow/credit given/expense/withdrawal).
2. "amount": Numeric float or integer without currency symbols (e.g. 500, not ₹500).
3. "balance": Numeric running balance if recorded, otherwise null.
4. "date": In YYYY-MM-DD format. If only day/month written (e.g. 5/8 or 5 Aug), use 2026 as the default year.
5. "category": Choose one of ["sales", "inventory", "repayment", "expense"].
6. Output MUST be strictly valid, raw JSON only. Do not include markdown code blocks, backticks, or intro/outro text.
"""


async def extract_ledger_from_image(
    image_bytes: bytes,
    filename: str = "ledger.jpg"
) -> Dict[str, Any]:
    """
    Submits image to Gemini Vision API and returns parsed JSON.
    Raises descriptive RuntimeError if OCR fails.
    """
    if not image_bytes:
        raise ValueError("No image data provided for OCR extraction.")

    client = _get_gemini_client()
    model = _resolve_model_name(client)

    from google.genai import types

    # Detect MIME type
    ext = filename.lower().split(".")[-1] if "." in filename else "jpg"
    mime_map = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp",
        "heic": "image/heic",
    }
    mime_type = mime_map.get(ext, "image/jpeg")

    try:
        logger.info(f"Dispatching OCR request to Gemini ({model}) for file: {filename}")
        response = client.models.generate_content(
            model=model,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                EXTRACTION_PROMPT,
            ]
        )
    except Exception as e:
        logger.error(f"Gemini Vision API call failed: {type(e).__name__}: {e}")
        raise RuntimeError(f"Gemini Vision API call failed: {e}")

    raw_text = response.text.strip() if response and response.text else ""
    if not raw_text:
        raise RuntimeError("Gemini returned an empty response. Ensure the image is legible.")

    # Remove markdown code formatting if present
    if raw_text.startswith("```"):
        lines = raw_text.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        raw_text = "\n".join(lines).strip()

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON from Gemini response: {e}\nRaw output: {raw_text}")
        raise RuntimeError(f"Could not parse structured JSON from OCR response: {e}")

    return data
