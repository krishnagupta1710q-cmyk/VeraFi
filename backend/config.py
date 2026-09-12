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

