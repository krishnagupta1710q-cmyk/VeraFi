"""
VeraFi Backend API Server
-------------------------
FastAPI service connecting frontend, AI extraction, and credit scoring.
"""

import os
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from credit_scorer import compute_verascore
from ai_extractor import extract_ledger_from_image, SAMPLE_MOCK_LEDGER

app = FastAPI(
    title="VeraFi API",
    description="Microfinance for the Credit-Invisible via AI Ledger Verification",
    version="1.0.0"
)

# Enable CORS for local React/Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory mock storage for demo loans
LOANS_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "loan_101",
        "merchant_name": "Sharma Ji Kirana & General Store",
        "business_type": "Grocery & Daily Needs",
        "location": "Lucknow, Uttar Pradesh",
        "requested_amount": 25000,
        "verascore": 745,
        "risk_level": "Low Risk",
        "monthly_turnover": 42500,
        "status": "pending",
        "applied_at": "2026-09-02T10:30:00Z",
        "ledger_id": "ledg_8912739"
    },
    {
        "id": "loan_102",
        "merchant_name": "Raju Tea & Snacks Corner",
        "business_type": "Food & Beverage",
        "location": "Kanpur, Uttar Pradesh",
        "requested_amount": 15000,
        "verascore": 680,
        "risk_level": "Moderate Risk",
        "monthly_turnover": 28000,
        "status": "pending",
        "applied_at": "2026-09-02T14:15:00Z",
        "ledger_id": "ledg_4412981"
    },
    {
        "id": "loan_103",
        "merchant_name": "Verma Dairy & Sweets",
        "business_type": "Dairy Retail",
        "location": "Varanasi, Uttar Pradesh",
        "requested_amount": 40000,
        "verascore": 590,
        "risk_level": "High Risk",
        "monthly_turnover": 32000,
        "status": "approved",
        "applied_at": "2026-09-01T09:00:00Z",
        "ledger_id": "ledg_2139044"
    }
]


class CalculateScoreRequest(BaseModel):
    transactions: List[Dict[str, Any]]
    requested_amount: Optional[float] = 25000.0


class LoanActionRequest(BaseModel):
    action: str  # "approve" or "reject"
    approved_amount: Optional[float] = 25000.0
    interest_rate_monthly: Optional[float] = 1.2
    tenure_months: Optional[int] = 3


@app.get("/")
def root():
    return {
        "project": "VeraFi",
        "status": "online",
        "docs_url": "/docs",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health_check():
    has_gemini = bool(os.getenv("GEMINI_API_KEY", "").strip())
    return {
        "status": "healthy",
        "gemini_api_configured": has_gemini
    }


@app.post("/api/upload-ledger")
async def upload_ledger(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None)
):
    """
    Accepts an uploaded image of a handwritten ledger or a sample_id.
    Parses transactions using AI and computes VeraScore.
    """
    image_bytes = b""
    filename = "sample.jpg"

    if file:
        image_bytes = await file.read()
        filename = file.filename

    # Extract transactions using Gemini Vision (or mock fallback)
    raw_data = await extract_ledger_from_image(image_bytes, filename)
    transactions = raw_data.get("transactions", [])

    # Calculate financial summary
    total_inflow = sum(tx.get("amount", 0) for tx in transactions if tx.get("type") == "jama")
    total_outflow = sum(tx.get("amount", 0) for tx in transactions if tx.get("type") == "udhar")
    active_days = len({tx.get("date") for tx in transactions if tx.get("date")})

    # Compute alternative credit score
    score_data = compute_verascore(transactions, requested_amount=25000)

    result = {
        "ledger_id": f"ledg_{abs(hash(filename)) % 10000000}",
        "merchant_name": raw_data.get("merchant_name", "Local Merchant Store"),
        "period": raw_data.get("period", "Recent"),
        "currency": raw_data.get("currency", "INR"),
        "summary": {
            "total_inflow": total_inflow,
            "total_outflow": total_outflow,
            "net_balance": total_inflow - total_outflow,
            "total_transactions": len(transactions),
            "active_days": active_days
        },
        "transactions": transactions,
        "verascore": score_data
    }

    return result


@app.post("/api/calculate-score")
def calculate_score(payload: CalculateScoreRequest):
    """
    Standalone endpoint to calculate or recalculate VeraScore.
    """
    return compute_verascore(payload.transactions, payload.requested_amount)


@app.get("/api/loans")
def get_loans():
    """
    Returns list of loan applications for the Lender Dashboard.
    """
    return LOANS_DATABASE


@app.post("/api/loans/{loan_id}/action")
def take_loan_action(loan_id: str, action_data: LoanActionRequest):
    """
    Approve or reject a loan application.
    """
    for loan in LOANS_DATABASE:
        if loan["id"] == loan_id:
            loan["status"] = "approved" if action_data.action == "approve" else "rejected"
            return {
                "success": True,
                "loan_id": loan_id,
                "status": loan["status"],
                "message": f"Loan {loan['id']} marked as {loan['status']}."
            }

    raise HTTPException(status_code=404, detail="Loan application not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

