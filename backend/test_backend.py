"""
VeraFi Backend Test Suite
-------------------------
Verifies VeraScore calculation, ledger validation, database persistence, and API endpoints.
"""

import sys
from database import init_db, SessionLocal, LoanApplication, LedgerRecord
from credit_scorer import compute_verascore
from validator import validate_ledger_math


def test_validator():
    print("Testing Ledger Math Validator...")
    # Consistent ledger
    txs_valid = [
        {"id": "1", "type": "jama", "amount": 1000, "balance": 1000},
        {"id": "2", "type": "jama", "amount": 500, "balance": 1500},
        {"id": "3", "type": "udhar", "amount": 300, "balance": 1200},
    ]
    is_ok, flags, score = validate_ledger_math(txs_valid)
    assert is_ok is True
    assert score == 1.0

    # Inconsistent ledger (math error)
    txs_bad = [
        {"id": "1", "type": "jama", "amount": 1000, "balance": 1000},
        {"id": "2", "type": "jama", "amount": 500, "balance": 9999},  # mismatch!
    ]
    is_ok, flags, score = validate_ledger_math(txs_bad)
    assert is_ok is False
    assert any("Discrepancy" in f for f in flags)
    print("✓ Validator passed!")


def test_credit_scorer():
    print("Testing Credit Scorer...")
    txs = [
        {"id": "1", "date": "2026-08-01", "customer_name": "Ramesh", "type": "jama", "amount": 2500, "balance": 2500},
        {"id": "2", "date": "2026-08-02", "customer_name": "Suresh", "type": "jama", "amount": 3200, "balance": 5700},
        {"id": "3", "date": "2026-08-03", "customer_name": "Milk Vendor", "type": "udhar", "amount": 1200, "balance": 4500},
        {"id": "4", "date": "2026-08-04", "customer_name": "Anita", "type": "jama", "amount": 1800, "balance": 6300},
        {"id": "5", "date": "2026-08-05", "customer_name": "Deepak", "type": "jama", "amount": 4000, "balance": 10300},
    ]
    res = compute_verascore(txs, requested_amount=25000.0)
    assert 300 <= res["score"] <= 850
    assert res["grade"] in ["A", "B+", "B", "C"]
    assert "factors" in res
    assert res["factors"]["volume_score"] >= 0
    assert res["factors"]["consistency_score"] >= 0
    print(f"✓ Credit Scorer passed! (Score: {res['score']}, Grade: {res['grade']}, Loan: ₹{res['max_eligible_loan']:,})")


def test_database():
    print("Testing SQLite Database & Seeding...")
    init_db()
    db = SessionLocal()
    try:
        count = db.query(LoanApplication).count()
        assert count >= 3
        loan = db.query(LoanApplication).first()
        assert loan.merchant_name is not None
        assert loan.verascore > 0
        print(f"✓ Database passed! ({count} loan records present)")
    finally:
        db.close()


def test_api_app():
    print("Testing FastAPI App Loading...")
    from main import app
    assert app.title == "VeraFi API"
    routes = [r.path for r in app.routes]
    assert "/api/upload-ledger" in routes
    assert "/api/loans" in routes
    assert "/health" in routes
    print(f"✓ FastAPI App passed! ({len(routes)} routes registered)")


if __name__ == "__main__":
    test_validator()
    test_credit_scorer()
    test_database()
    test_api_app()
    print("\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!")
