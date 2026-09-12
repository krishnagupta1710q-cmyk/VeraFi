"""
VeraFi AI Vision Extractor
--------------------------
Extracts structured ledger transactions from handwritten images using Gemini 1.5 Flash.
Includes graceful fallback to realistic mock data if API key is not configured.
"""

import os
import json
import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Sample realistic fallback data for local offline development / demo
SAMPLE_MOCK_LEDGER = {
    "merchant_name": "Sharma Ji Kirana & General Store",
    "period": "August 2026",
    "currency": "INR",
    "transactions": [
        {
            "id": "tx_1",
            "date": "2026-08-01",
            "customer_name": "Ramesh Kumar",
            "type": "jama",
            "amount": 2800,
            "balance": 2800,
            "category": "sales",
            "note": "Atta, Rice 25kg"
        },
        {
            "id": "tx_2",
            "date": "2026-08-02",
            "customer_name": "Gupta Dairy",
            "type": "udhar",
            "amount": 1400,
            "balance": 1400,
            "category": "inventory",
            "note": "Milk & Paneer stock"
        },
        {
            "id": "tx_3",
            "date": "2026-08-03",
            "customer_name": "Anita Sharma",
            "type": "jama",
            "amount": 3500,
            "balance": 4900,
            "category": "sales",
            "note": "Monthly grocery bill"
        },
        {
            "id": "tx_4",
            "date": "2026-08-04",
            "customer_name": "Pooja Provision",
            "type": "udhar",
            "amount": 2100,
            "balance": 2800,
            "category": "inventory",
            "note": "Refined Oil cartons"
        },
        {
            "id": "tx_5",
            "date": "2026-08-05",
            "customer_name": "Suresh Tea Stall",
            "type": "jama",
            "amount": 4200,
            "balance": 7000,
            "category": "sales",
            "note": "Sugar & Tea supply"
        },
        {
            "id": "tx_6",
            "date": "2026-08-06",
            "customer_name": "Deepak Verma",
            "type": "jama",
            "amount": 3100,
            "balance": 10100,
            "category": "sales",
            "note": "Spices & pulses"
        }
    ]
}


async def extract_ledger_from_image(image_bytes: bytes, filename: str = "ledger.jpg") -> Dict[str, Any]:
    """
    Parses a paper ledger image into structured JSON using Gemini Vision.
    Falls back to mock data if GEMINI_API_KEY is not set or API fails.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key or api_key == "your_gemini_api_key_here":
        logger.info("Using mock ledger data (GEMINI_API_KEY not configured).")
        return SAMPLE_MOCK_LEDGER

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = """
        You are an expert financial document auditor and OCR specialist for informal microfinance.
        Analyze this image of a handwritten merchant paper ledger (Bahi-Khata / Khatabook / Receipt).
        Extract all recorded transactions into this exact JSON format:
        {
          "merchant_name": "<detected or inferred store name>",
          "period": "<date or month if visible>",
          "currency": "INR",
          "transactions": [
            {
              "id": "tx_1",
              "date": "YYYY-MM-DD",
              "customer_name": "<name of customer or supplier>",
              "type": "jama" or "udhar",  // jama = credit/inflow/received, udhar = debit/outflow/pending credit
              "amount": <number>,
              "balance": <running balance if recorded, else null>,
              "category": "sales" or "inventory" or "repayment",
              "note": "<items bought or remarks>"
            }
          ]
        }
        Return ONLY pure valid JSON, without any markdown fences, backticks, or extra commentary.
        """

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                prompt
            ]
        )

        clean_text = response.text.strip()
        if clean_text.startswith("```"):
            clean_text = clean_text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        data = json.loads(clean_text)
        return data

    except Exception as e:
        logger.warning(f"Gemini API call failed: {e}. Falling back to sample mock ledger.")
        return SAMPLE_MOCK_LEDGER

