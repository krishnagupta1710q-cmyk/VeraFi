"""
VeraFi AI Vision Ledger Extractor
---------------------------------
Parses handwritten paper ledgers (Bahi-Khata/Khatabook) into structured JSON.
Integrates with Google Gemini Vision when API key is provided,
with built-in realistic mock datasets for offline demos and testing.
"""

import os
import json
import logging
from typing import Dict, Any, List
from config import GEMINI_API_KEY, GEMINI_MODEL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Preloaded sample datasets for instant demoing without API keys
SAMPLE_LEDGERS = {
    "kirana_store": {
        "merchant_name": "Sharma Ji Kirana & General Store",
        "business_type": "Grocery & Daily Essentials",
        "location": "Alambagh, Lucknow",
        "period": "August 2026",
        "currency": "INR",
        "transactions": [
            {"id": "tx_1", "date": "2026-08-01", "customer_name": "Ramesh Kumar", "type": "jama", "amount": 2800, "balance": 2800, "category": "sales", "note": "Atta, Rice 25kg"},
            {"id": "tx_2", "date": "2026-08-02", "customer_name": "Gupta Dairy", "type": "udhar", "amount": 1400, "balance": 1400, "category": "inventory", "note": "Milk & Paneer stock"},
            {"id": "tx_3", "date": "2026-08-03", "customer_name": "Anita Sharma", "type": "jama", "amount": 3500, "balance": 4900, "category": "sales", "note": "Monthly grocery bill"},
            {"id": "tx_4", "date": "2026-08-04", "customer_name": "Pooja Provisions", "type": "udhar", "amount": 2100, "balance": 2800, "category": "inventory", "note": "Refined Oil cartons"},
            {"id": "tx_5", "date": "2026-08-05", "customer_name": "Suresh Tea Stall", "type": "jama", "amount": 4200, "balance": 7000, "category": "sales", "note": "Sugar & Tea supply"},
            {"id": "tx_6", "date": "2026-08-06", "customer_name": "Deepak Verma", "type": "jama", "amount": 3100, "balance": 10100, "category": "sales", "note": "Spices & pulses"},
            {"id": "tx_7", "date": "2026-08-06", "customer_name": "Mishra Ji", "type": "jama", "amount": 1800, "balance": 11900, "category": "sales", "note": "Soap & detergent"},
            {"id": "tx_8", "date": "2026-08-07", "customer_name": "Wholesale Mandi", "type": "udhar", "amount": 5000, "balance": 6900, "category": "inventory", "note": "Grains replenishment"}
        ]
    },
    "tea_stall": {
        "merchant_name": "Raju Chai & Snacks Corner",
        "business_type": "Tea & Street Food",
        "location": "Civil Lines, Kanpur",
        "period": "August 2026",
        "currency": "INR",
        "transactions": [
            {"id": "tx_10", "date": "2026-08-01", "customer_name": "Daily Cash Counter", "type": "jama", "amount": 4500, "balance": 4500, "category": "sales", "note": "Morning & evening sales"},
            {"id": "tx_11", "date": "2026-08-02", "customer_name": "Yadav Milk Vendor", "type": "udhar", "amount": 3200, "balance": 1300, "category": "inventory", "note": "Milk 60 liters"},
            {"id": "tx_12", "date": "2026-08-03", "customer_name": "Coaching Staff", "type": "jama", "amount": 2800, "balance": 4100, "category": "sales", "note": "Weekly tea subscription"},
            {"id": "tx_13", "date": "2026-08-04", "customer_name": "Bakery Supplies", "type": "udhar", "amount": 1500, "balance": 2600, "category": "inventory", "note": "Biscuits & rusk"},
            {"id": "tx_14", "date": "2026-08-05", "customer_name": "Daily Cash Counter", "type": "jama", "amount": 5100, "balance": 7700, "category": "sales", "note": "Snacks & chai revenue"}
        ]
    }
}


async def extract_ledger_from_image(
    image_bytes: bytes = b"",
    filename: str = "ledger.jpg",
    sample_id: str = None
) -> Dict[str, Any]:
    """
    Extracts structured transactions from an uploaded image or sample key.
    Uses Gemini Vision if configured, otherwise falls back cleanly to sample data.
    """
    # 1. If explicit sample ID requested, return directly
    if sample_id and sample_id in SAMPLE_LEDGERS:
        return SAMPLE_LEDGERS[sample_id]

    api_key = GEMINI_API_KEY.strip()

    # 2. Check if API key looks usable (non-empty, not a placeholder)
    placeholders = {"", "your_gemini_api_key_here", "test_secret_key_12345"}
    if api_key in placeholders or len(api_key) < 10 or not image_bytes:
        logger.info("Using mock ledger data (no valid Gemini key or no image bytes).")
        return SAMPLE_LEDGERS["kirana_store"]

    # 3. Call Gemini Vision
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = """
        You are an expert financial auditor and OCR engine for Indian informal microfinance.
        Analyze this handwritten merchant paper ledger (Bahi-Khata / Khatabook / Receipt).
        Extract all recorded transactions into this exact JSON format:
        {
          "merchant_name": "<detected store name or 'Local Merchant Store'>",
          "business_type": "<grocery, tea stall, dairy, etc.>",
          "location": "<city if detected, or 'Local Market'>",
          "period": "<date or month if visible>",
          "currency": "INR",
          "transactions": [
            {
              "id": "tx_1",
              "date": "YYYY-MM-DD",
              "customer_name": "<customer or supplier name>",
              "type": "jama" or "udhar",
              "amount": <numeric amount>,
              "balance": <recorded running balance or null>,
              "category": "sales" or "inventory" or "repayment",
              "note": "<items or remarks>"
            }
          ]
        }
        Return ONLY valid, pure JSON without backticks, markdown fences, or preamble.
        """

        response = client.models.generate_content(
            model=GEMINI_MODEL,
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
        logger.error(f"Gemini OCR FAILED: {type(e).__name__}: {e}")
        raise RuntimeError(f"Gemini Vision failed: {type(e).__name__}: {e}")
