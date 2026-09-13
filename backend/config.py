import os
from pathlib import Path
from dotenv import load_dotenv

# Locate the directory where this config file resides
BASE_DIR = Path(__file__).resolve().parent

# Load environment variables from .env (checks backend/.env first, then root .env)
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

# Configuration variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Gemini vision model used for ledger OCR. Overridable via env so the
# project keeps working when Google retires a model version.
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'verafi.db'}")