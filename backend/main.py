"""
VeraFi FastAPI Application Server
---------------------------------
Main entrypoint for VeraFi backend:
- Bridges Gemini Vision handwriting OCR
- Calculates VeraScore alternative credit rating
- Manages SQLite database for ledgers and microloans
"""

import base64
import uuid
import logging
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import config
from database import get_db, init_db, LedgerRecord, TransactionRecord, LoanApplication
from schemas import (
    LedgerResponse,
    LedgerSummarySchema,
    TransactionSchema,
    VeraScoreResultSchema,
    VeraScoreFactorsSchema,
    CalculateScoreRequest,
    LoanApplicationSchema,
    LoanActionRequest,
    LoanActionResponse,
)
from ai_extractor import extract_ledger_from_image
from credit_scorer import compute_verascore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("verafi")

# 1. Instantiate FastAPI Application
app = FastAPI(
    title="VeraFi API",
    description="AI-Powered Microfinance for the Credit-Invisible",
    version="1.0.0"
)

# 2. Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """Initializes tables and seeds initial demo loans if database is empty."""
    init_db()
    logger.info("VeraFi database initialized successfully.")


@app.get("/")
def read_root():
    return {
        "service": "VeraFi API",
        "status": "online",
        "version": "1.0.0",
        "description": "AI-Powered Microfinance for the Credit-Invisible"
    }


@app.get("/health")
def health_check():
    key_configured = bool(config.GEMINI_API_KEY and len(config.GEMINI_API_KEY.strip()) > 10)
    return {
        "status": "healthy",
        "gemini_configured": key_configured,
        "database": "sqlite_connected"
    }


@app.get("/api/test-gemini")
async def test_gemini():
    """Diagnostic endpoint to verify Gemini API connection and available models."""
    api_key = config.GEMINI_API_KEY.strip()
    if not api_key:
        return {"status": "error", "message": "GEMINI_API_KEY is not set in backend/.env"}

    try:
        from google import genai
        if api_key.startswith("AQ.") or api_key.startswith("ya29."):
            import google.oauth2.credentials
            client = genai.Client(credentials=google.oauth2.credentials.Credentials(api_key))
        else:
            client = genai.Client(api_key=api_key)
        all_models = [m.name for m in client.models.list()]
        flash_models = [m for m in all_models if "flash" in m.lower() and "embed" not in m.lower()]
        selected_model = config.GEMINI_MODEL or (flash_models[0] if flash_models else (all_models[0] if all_models else "gemini-3.6-flash"))

        response = client.models.generate_content(
            model=selected_model,
            contents="Respond with strictly: GEMINI_READY"
        )
        return {
            "status": "success",
            "model_tested": selected_model,
            "response": response.text.strip(),
            "flash_models": flash_models[:5]
        }
    except Exception as e:
        logger.error(f"Test Gemini failed: {e}")
        return {
            "status": "error",
            "error_type": type(e).__name__,
            "detail": str(e)
        }


@app.post("/api/upload-ledger", response_model=LedgerResponse)
async def upload_ledger(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Ingests photo of handwritten ledger, calls Gemini Vision OCR,
    calculates VeraScore, records in database, and outputs verified financial ledger.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Convert to base64 Data URI for immediate side-by-side frontend snapshot
    ext = file.filename.lower().split(".")[-1] if file.filename and "." in file.filename else "jpg"
    mime = "image/png" if ext == "png" else ("image/webp" if ext == "webp" else "image/jpeg")
    b64_str = base64.b64encode(image_bytes).decode("utf-8")
    data_uri = f"data:{mime};base64,{b64_str}"

    # 1. AI Handwriting Extraction using Gemini Vision
    try:
        extracted = await extract_ledger_from_image(image_bytes, file.filename or "ledger.jpg")
    except Exception as e:
        logger.error(f"Extraction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Vision extraction failed: {str(e)}"
        )

    raw_txs = extracted.get("transactions", [])
    merchant_name = extracted.get("merchant_name", "Local Merchant Store")
    business_type = extracted.get("business_type", "Retail & Essentials")
    location = extracted.get("location", "India")
    period = extracted.get("period", "Recent")
    currency = extracted.get("currency", "INR")

    # 2. Calculate Financial Aggregates
    inflow = sum(float(tx.get("amount", 0.0)) for tx in raw_txs if tx.get("type") == "jama")
    outflow = sum(float(tx.get("amount", 0.0)) for tx in raw_txs if tx.get("type") == "udhar")
    active_days = len({str(tx.get("date")) for tx in raw_txs if tx.get("date")}) or 1
    net_balance = inflow - outflow

    # 3. Calculate VeraScore Alternative Credit Profile
    verascore_data = compute_verascore(raw_txs, requested_amount=25000.0)

    # 4. Save to SQLite Database
    ledger_id = f"ledg_{uuid.uuid4().hex[:8]}"

    new_ledger = LedgerRecord(
        id=ledger_id,
        merchant_name=merchant_name,
        business_type=business_type,
        location=location,
        period=period,
        currency=currency,
        total_inflow=inflow,
        total_outflow=outflow,
        net_balance=net_balance,
        total_transactions=len(raw_txs),
        active_days=active_days,
        verascore=verascore_data["score"],
        risk_level=verascore_data["risk_level"]
    )
    db.add(new_ledger)

    for idx, tx in enumerate(raw_txs, start=1):
        db_tx = TransactionRecord(
            id=f"{ledger_id}_tx_{idx}",
            ledger_id=ledger_id,
            date=str(tx.get("date", "2026-01-01")),
            customer_name=str(tx.get("customer_name", f"Customer #{idx}")),
            type=str(tx.get("type", "jama")).lower(),
            amount=float(tx.get("amount", 0.0)),
            balance=float(tx["balance"]) if tx.get("balance") is not None else None,
            category=str(tx.get("category", "sales")),
            note=str(tx.get("note", ""))
        )
        db.add(db_tx)

    # 5. Create Loan Application for Lender Portal
    loan_id = f"loan_{uuid.uuid4().hex[:6]}"
    new_loan = LoanApplication(
        id=loan_id,
        merchant_name=merchant_name,
        business_type=business_type,
        location=location,
        requested_amount=25000.0,
        approved_amount=float(verascore_data["max_eligible_loan"]),
        verascore=verascore_data["score"],
        risk_level=verascore_data["risk_level"],
        monthly_turnover=inflow,
        status="pending",
        applied_at="Just now",
        ledger_id=ledger_id
    )
    db.add(new_loan)
    db.commit()

    # 6. Format Response
    summary_obj = LedgerSummarySchema(
        total_inflow=inflow,
        total_outflow=outflow,
        net_balance=net_balance,
        total_transactions=len(raw_txs),
        active_days=active_days
    )

    transactions_obj = [
        TransactionSchema(
            id=f"tx_{i}",
            date=str(tx.get("date", "2026-01-01")),
            customer_name=str(tx.get("customer_name", "Customer")),
            type=str(tx.get("type", "jama")).lower(),
            amount=float(tx.get("amount", 0.0)),
            balance=float(tx["balance"]) if tx.get("balance") is not None else None,
            category=str(tx.get("category", "sales")),
            note=str(tx.get("note", ""))
        )
        for i, tx in enumerate(raw_txs, start=1)
    ]

    verascore_obj = VeraScoreResultSchema(
        score=verascore_data["score"],
        grade=verascore_data["grade"],
        risk_level=verascore_data["risk_level"],
        max_eligible_loan=verascore_data["max_eligible_loan"],
        factors=VeraScoreFactorsSchema(
            volume_score=verascore_data["factors"]["volume_score"],
            consistency_score=verascore_data["factors"]["consistency_score"],
            diversity_score=verascore_data["factors"]["diversity_score"],
            cadence_score=verascore_data["factors"]["cadence_score"]
        ),
        recommendation=verascore_data["recommendation"],
        flags=verascore_data.get("flags", [])
    )

    return LedgerResponse(
        ledger_id=ledger_id,
        merchant_name=merchant_name,
        business_type=business_type,
        location=location,
        period=period,
        currency=currency,
        image_url=data_uri,
        summary=summary_obj,
        transactions=transactions_obj,
        verascore=verascore_obj
    )


@app.get("/api/loans", response_model=List[LoanApplicationSchema])
def list_loans(db: Session = Depends(get_db)):
    """Retrieves all loan applications for the Lender Portal."""
    loans = db.query(LoanApplication).order_by(LoanApplication.id.desc()).all()
    return [
        LoanApplicationSchema(
            id=loan.id,
            merchant_name=loan.merchant_name,
            business_type=loan.business_type,
            location=loan.location,
            requested_amount=loan.requested_amount,
            approved_amount=loan.approved_amount,
            verascore=loan.verascore,
            risk_level=loan.risk_level,
            monthly_turnover=loan.monthly_turnover,
            status=loan.status,
            applied_at=loan.applied_at,
            ledger_id=loan.ledger_id
        )
        for loan in loans
    ]


@app.post("/api/loans/{loan_id}/action", response_model=LoanActionResponse)
def handle_loan_action(
    loan_id: str,
    payload: LoanActionRequest,
    db: Session = Depends(get_db)
):
    """Allows lenders to approve or reject a microloan application."""
    loan = db.query(LoanApplication).filter(LoanApplication.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail=f"Loan application '{loan_id}' not found.")

    loan.status = "approved" if payload.action == "approve" else "rejected"
    if payload.approved_amount is not None:
        loan.approved_amount = payload.approved_amount

    db.commit()

    return LoanActionResponse(
        success=True,
        loan_id=loan.id,
        status=loan.status,
        message=f"Loan {loan.id} has been {loan.status} successfully."
    )


@app.post("/api/calculate-score", response_model=VeraScoreResultSchema)
def calculate_score(payload: CalculateScoreRequest):
    """Calculates VeraScore from a list of transactions."""
    raw_txs = [t.model_dump() for t in payload.transactions]
    res = compute_verascore(raw_txs, requested_amount=payload.requested_amount or 25000.0)
    return VeraScoreResultSchema(
        score=res["score"],
        grade=res["grade"],
        risk_level=res["risk_level"],
        max_eligible_loan=res["max_eligible_loan"],
        factors=VeraScoreFactorsSchema(**res["factors"]),
        recommendation=res["recommendation"],
        flags=res.get("flags", [])
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
