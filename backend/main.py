"""
VeraFi FastAPI Application Server
---------------------------------
Complete backend API connecting AI ledger extraction,
mathematical validation, VeraScore credit assessment, and SQLite persistence.
"""

from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import config
from database import engine, Base, get_db
from models import Ledger, Transaction, Loan
from schemas import (
    LedgerResponse,
    LedgerSummarySchema,
    TransactionSchema,
    VeraScoreResultSchema,
    VeraScoreFactorsSchema,
    CalculateScoreRequest,
    LoanApplicationSchema,
    LoanActionRequest,
    LoanActionResponse
)
from validator import validate_ledger_math
from credit_scorer import compute_verascore
from ai_extractor import extract_ledger_from_image

# 1. Initialize database tables
Base.metadata.create_all(bind=engine)

# 2. Create FastAPI application
app = FastAPI(
    title="VeraFi API",
    description="AI-Powered Microfinance for the Credit-Invisible",
    version="1.0.0"
)

# 3. Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def seed_initial_loans():
    """Seeds initial demo loans if they don't already exist in database."""
    from database import SessionLocal
    db = SessionLocal()
    try:
        seed_data = [
            Loan(
                id="loan_101",
                merchant_name="Sharma Ji Kirana Store",
                business_type="Grocery & Essentials",
                location="Lucknow, UP",
                requested_amount=25000,
                approved_amount=25000,
                verascore=745,
                risk_level="Low Risk",
                monthly_turnover=42500,
                status="pending",
                applied_at="2 hours ago",
                ledger_id="ledg_8912739"
            ),
            Loan(
                id="loan_102",
                merchant_name="Raju Chai & Snacks Corner",
                business_type="Tea & Street Food",
                location="Kanpur, UP",
                requested_amount=15000,
                approved_amount=15000,
                verascore=685,
                risk_level="Moderate Risk",
                monthly_turnover=26800,
                status="pending",
                applied_at="5 hours ago",
                ledger_id="ledg_4412981"
            ),
            Loan(
                id="loan_103",
                merchant_name="Verma Dairy & Sweets",
                business_type="Dairy Farm",
                location="Varanasi, UP",
                requested_amount=35000,
                approved_amount=None,
                verascore=590,
                risk_level="High Risk",
                monthly_turnover=19000,
                status="rejected",
                applied_at="1 day ago",
                ledger_id="ledg_2139044"
            )
        ]
        for item in seed_data:
            if not db.query(Loan).filter(Loan.id == item.id).first():
                db.add(item)
        db.commit()
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "VeraFi backend is running"}


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_api_configured": bool(config.GEMINI_API_KEY.strip()),
        "gemini_key_prefix": config.GEMINI_API_KEY.strip()[:6] + "...",
        "database": "sqlite_ready"
    }


@app.get("/api/test-gemini")
async def test_gemini():
    """Diagnostic: lists available models and tests the Gemini API key."""
    api_key = config.GEMINI_API_KEY.strip()
    if not api_key or len(api_key) < 10:
        return {"status": "error", "message": "No API key configured in backend/.env"}
    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        # List all models available for this key
        all_models = [m.name for m in client.models.list()]
        flash_models = [m for m in all_models if "flash" in m.lower()]

        # Use the first available flash model
        model_to_use = flash_models[0] if flash_models else (all_models[0] if all_models else config.GEMINI_MODEL)

        response = client.models.generate_content(
            model=model_to_use,
            contents="Reply with exactly: GEMINI_KEY_WORKS"
        )
        return {
            "status": "success",
            "key_prefix": api_key[:8] + "...",
            "model_used": model_to_use,
            "flash_models_available": flash_models[:6],
            "gemini_response": response.text.strip()
        }
    except Exception as e:
        return {
            "status": "error",
            "key_prefix": api_key[:8] + "...",
            "error_type": type(e).__name__,
            "error": str(e)
        }


@app.post("/api/upload-ledger", response_model=LedgerResponse)
async def upload_ledger(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Ingests handwritten ledger image or sample, audits math consistency,
    computes VeraScore, and records the application in SQLite.
    """
    image_bytes = b""
    filename = "sample.jpg"
    if file:
        image_bytes = await file.read()
        filename = file.filename

    # 1. OCR Extraction (Gemini Vision or realistic sample fallback)
    raw_data = await extract_ledger_from_image(image_bytes, filename, sample_id)
    raw_txs = raw_data.get("transactions", [])

    # 2. Financial totals
    inflow = sum(float(tx.get("amount", 0)) for tx in raw_txs if tx.get("type") == "jama")
    outflow = sum(float(tx.get("amount", 0)) for tx in raw_txs if tx.get("type") == "udhar")
    active_days = len({str(tx.get("date")) for tx in raw_txs if tx.get("date")})

    # 3. Compute VeraScore (includes math validation audit)
    score_res = compute_verascore(raw_txs, requested_amount=25000.0)

    ledger_id = f"ledg_{abs(hash(raw_data.get('merchant_name', '') + str(inflow))) % 10000000}"
    merchant_name = raw_data.get("merchant_name", "Local Merchant Store")
    business_type = raw_data.get("business_type", "Retail & Daily Needs")
    location = raw_data.get("location", "Lucknow, UP")

    # 4. Save Ledger and Transactions in SQLite
    new_ledger = Ledger(
        id=ledger_id,
        merchant_name=merchant_name,
        business_type=business_type,
        location=location,
        period=raw_data.get("period", "August 2026"),
        currency=raw_data.get("currency", "INR"),
        total_inflow=inflow,
        total_outflow=outflow,
        net_balance=inflow - outflow,
        total_transactions=len(raw_txs),
        active_days=active_days,
        verascore=score_res["score"],
        risk_level=score_res["risk_level"]
    )
    db.merge(new_ledger)

    for tx in raw_txs:
        db_tx = Transaction(
            id=f"{ledger_id}_{tx.get('id', 'tx')}",
            ledger_id=ledger_id,
            date=str(tx.get("date", "2026-08-01")),
            customer_name=str(tx.get("customer_name", "Customer")),
            type=str(tx.get("type", "jama")),
            amount=float(tx.get("amount", 0.0)),
            balance=float(tx.get("balance")) if tx.get("balance") is not None else None,
            category=str(tx.get("category", "general")),
            note=str(tx.get("note", ""))
        )
        db.merge(db_tx)

    # 5. Create loan application for the lender queue
    loan_id = f"loan_{abs(hash(ledger_id)) % 10000}"
    new_loan = Loan(
        id=loan_id,
        merchant_name=merchant_name,
        business_type=business_type,
        location=location,
        requested_amount=25000.0,
        approved_amount=float(score_res["max_eligible_loan"]),
        verascore=score_res["score"],
        risk_level=score_res["risk_level"],
        monthly_turnover=inflow,
        status="pending",
        applied_at="Just now",
        ledger_id=ledger_id
    )
    db.merge(new_loan)
    db.commit()

    # 6. Format Response
    summary = LedgerSummarySchema(
        total_inflow=inflow,
        total_outflow=outflow,
        net_balance=inflow - outflow,
        total_transactions=len(raw_txs),
        active_days=active_days
    )

    transactions_formatted = [
        TransactionSchema(
            id=str(tx.get("id", f"tx_{idx}")),
            date=str(tx.get("date", "2026-08-01")),
            customer_name=str(tx.get("customer_name", "Customer")),
            type=str(tx.get("type", "jama")),
            amount=float(tx.get("amount", 0)),
            balance=float(tx["balance"]) if tx.get("balance") is not None else None,
            category=str(tx.get("category", "general")),
            note=str(tx.get("note", ""))
        )
        for idx, tx in enumerate(raw_txs, start=1)
    ]

    verascore_formatted = VeraScoreResultSchema(
        score=score_res["score"],
        grade=score_res["grade"],
        risk_level=score_res["risk_level"],
        max_eligible_loan=score_res["max_eligible_loan"],
        factors=VeraScoreFactorsSchema(
            volume_score=score_res["factors"]["volume_score"],
            consistency_score=score_res["factors"]["consistency_score"],
            diversity_score=score_res["factors"]["diversity_score"],
            cadence_score=score_res["factors"]["cadence_score"]
        ),
        recommendation=score_res["recommendation"],
        flags=score_res.get("flags", [])
    )

    return LedgerResponse(
        ledger_id=ledger_id,
        merchant_name=merchant_name,
        period=raw_data.get("period", "August 2026"),
        currency=raw_data.get("currency", "INR"),
        summary=summary,
        transactions=transactions_formatted,
        verascore=verascore_formatted
    )


@app.post("/api/calculate-score", response_model=VeraScoreResultSchema)
def calculate_score(payload: CalculateScoreRequest):
    """Calculates or recalculates VeraScore from a list of transactions."""
    raw_txs = [tx.dict() for tx in payload.transactions]
    score_res = compute_verascore(raw_txs, payload.requested_amount or 25000.0)
    return VeraScoreResultSchema(
        score=score_res["score"],
        grade=score_res["grade"],
        risk_level=score_res["risk_level"],
        max_eligible_loan=score_res["max_eligible_loan"],
        factors=VeraScoreFactorsSchema(**score_res["factors"]),
        recommendation=score_res["recommendation"],
        flags=score_res.get("flags", [])
    )


@app.get("/api/loans", response_model=List[LoanApplicationSchema])
def get_loans(db: Session = Depends(get_db)):
    """Retrieves all loan applications from SQLite for the Lender Portal."""
    loans = db.query(Loan).order_by(Loan.id.desc()).all()
    return [
        LoanApplicationSchema(
            id=l.id,
            merchant_name=l.merchant_name,
            business_type=l.business_type,
            location=l.location,
            requested_amount=l.requested_amount,
            verascore=l.verascore,
            risk_level=l.risk_level,
            monthly_turnover=l.monthly_turnover,
            status=l.status,
            applied_at=l.applied_at,
            ledger_id=l.ledger_id
        )
        for l in loans
    ]


@app.post("/api/loans/{loan_id}/action", response_model=LoanActionResponse)
def take_loan_action(
    loan_id: str,
    action_data: LoanActionRequest,
    db: Session = Depends(get_db)
):
    """Approves or rejects a loan application."""
    loan = db.query(Loan).filter(Loan.id == loan_id).first()
    if not loan:
        raise HTTPException(status_code=404, detail=f"Loan {loan_id} not found")

    loan.status = "approved" if action_data.action == "approve" else "rejected"
    if action_data.approved_amount:
        loan.approved_amount = action_data.approved_amount
    if action_data.interest_rate_monthly:
        loan.interest_rate_monthly = action_data.interest_rate_monthly
    if action_data.tenure_months:
        loan.tenure_months = action_data.tenure_months

    db.commit()

    return LoanActionResponse(
        success=True,
        loan_id=loan.id,
        status=loan.status,
        message=f"Loan {loan.id} has been {loan.status}."
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
