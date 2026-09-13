"""
VeraFi Configuration Module
---------------------------
Loads environment variables for Gemini API and Database configuration.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

# Load .env from backend/ or root
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'verafi.db'}")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
