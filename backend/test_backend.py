"""
VeraFi Backend Unit Tests
-------------------------
Automated test suite using Python's standard unittest framework.
Tests math validation, VeraScore calculations, and SQLite database persistence.
"""

import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from validator import validate_ledger_math
from credit_scorer import compute_verascore
from database import engine, SessionLocal, Base
from models import Loan


class TestVeraFiBackend(unittest.TestCase):

    def setUp(self):
        """Prepare clean and tampered sample transaction data."""
        self.clean_transactions = [
            {"id": "tx_1", "date": "2026-08-01", "customer_name": "Ramesh Kumar", "type": "jama", "amount": 2500, "balance": 2500},
            {"id": "tx_2", "date": "2026-08-02", "customer_name": "Gupta Dairy", "type": "udhar", "amount": 1000, "balance": 1500},
            {"id": "tx_3", "date": "2026-08-03", "customer_name": "Anita Devi", "type": "jama", "amount": 3000, "balance": 4500},
            {"id": "tx_4", "date": "2026-08-04", "customer_name": "Suresh Chai", "type": "jama", "amount": 1500, "balance": 6000},
            {"id": "tx_5", "date": "2026-08-05", "customer_name": "Deepak Verma", "type": "jama", "amount": 2000, "balance": 8000},
        ]

        self.tampered_transactions = [
            {"id": "tx_1", "date": "2026-08-01", "customer_name": "Ramesh", "type": "jama", "amount": 1000, "balance": 1000},
            # Math error: 1000 - 400 = 600, but written balance says 1600!
            {"id": "tx_2", "date": "2026-08-02", "customer_name": "Dairy", "type": "udhar", "amount": 400, "balance": 1600},
        ]

    def test_validator_clean_ledger(self):
        """Clean ledger should pass with 100% integrity score and 0 discrepancies."""
        report = validate_ledger_math(self.clean_transactions)
        self.assertTrue(report["is_valid"])
        self.assertEqual(report["integrity_score"], 100)
        self.assertEqual(len(report["discrepancies"]), 0)

    def test_validator_tampered_balance_detection(self):
        """Math validator should catch altered running balances and flag entries."""
        report = validate_ledger_math(self.tampered_transactions)
        self.assertFalse(report["is_valid"])
        self.assertLess(report["integrity_score"], 100)
        self.assertGreater(len(report["discrepancies"]), 0)
        self.assertIn("tx_2", report["flagged_entries"])

    def test_credit_scorer_healthy_profile(self):
        """Consistent shopkeeper should receive Grade A or B+ with VeraScore >= 680."""
        score_data = compute_verascore(self.clean_transactions, requested_amount=15000)
        self.assertGreaterEqual(score_data["score"], 680)
        self.assertIn(score_data["grade"], ["A", "B+", "B"])
        self.assertGreater(score_data["max_eligible_loan"], 0)

    def test_database_persistence_and_approval(self):
        """Database should store, query, and update loan applications in SQLite."""
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            # Create a test loan
            test_loan = Loan(
                id="loan_test_99",
                merchant_name="Demo Kirana",
                business_type="Retail",
                location="Lucknow, UP",
                requested_amount=20000,
                verascore=720,
                risk_level="Low Risk",
                monthly_turnover=35000,
                status="pending"
            )
            db.merge(test_loan)
            db.commit()

            # Query loan
            saved_loan = db.query(Loan).filter(Loan.id == "loan_test_99").first()
            self.assertIsNotNone(saved_loan)
            self.assertEqual(saved_loan.status, "pending")

            # Approve loan
            saved_loan.status = "approved"
            db.commit()

            updated_loan = db.query(Loan).filter(Loan.id == "loan_test_99").first()
            self.assertEqual(updated_loan.status, "approved")
        finally:
            db.close()


if __name__ == "__main__":
    unittest.main(verbosity=2)
