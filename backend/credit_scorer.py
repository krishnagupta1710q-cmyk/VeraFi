"""
VeraFi Credit Assessment Engine (VeraScore™)
--------------------------------------------
Computes an objective credit score (300 to 850) based on 4 pillars:
1. Cash Flow Volume (35% weight)
2. Business Consistency (35% weight)
3. Customer Diversity (20% weight)
4. Repayment Cadence (10% weight)

Plus mathematical integrity checks from validator.py.
"""

from typing import List, Dict, Any
from validator import validate_ledger_math


def compute_verascore(
    transactions: List[Dict[str, Any]],
    requested_amount: float = 25000.0
) -> Dict[str, Any]:
    """
    Computes VeraScore and eligible microloan terms from digitized transactions.
    """
    if not transactions:
        return {
            "score": 300,
            "grade": "C",
            "risk_level": "High Risk",
            "max_eligible_loan": 0,
            "factors": {
                "volume_score": 0,
                "consistency_score": 0,
                "diversity_score": 0,
                "cadence_score": 0,
            },
            "recommendation": "No transactions found to compute credit score.",
            "flags": ["Empty ledger submitted."]
        }

    # Separate Inflows (Jama) and Outflows (Udhar)
    jama_txs = [t for t in transactions if str(t.get("type", "")).lower() == "jama"]
    udhar_txs = [t for t in transactions if str(t.get("type", "")).lower() == "udhar"]

    total_jama = sum(float(t.get("amount", 0.0)) for t in jama_txs)
    total_udhar = sum(float(t.get("amount", 0.0)) for t in udhar_txs)

    # 1. Cash Flow Volume (35%)
    # Ratio of daily average inflow compared to 30-day loan repayment expectation
    dates = {str(t.get("date")) for t in transactions if t.get("date")}
    active_days = max(1, len(dates))
    daily_turnover = total_jama / active_days

    # Target: daily inflow of ₹1,000 to ₹1,500 represents healthy micro-enterprise
    target_daily = max(requested_amount / 25.0, 800.0)
    volume_score = min(100, int((daily_turnover / target_daily) * 100))

    # 2. Business Consistency (35%)
    # How active the merchant is over time (active days vs 10-day benchmark for short ledgers)
    consistency_score = min(100, int((active_days / min(active_days + 2, 8)) * 100))

    # 3. Customer Diversity (20%)
    # Number of unique buyers reduces reliance on single counterparty
    unique_customers = len({
        str(t.get("customer_name", "")).strip().lower()
        for t in jama_txs
        if t.get("customer_name")
    })
    diversity_score = min(100, int((unique_customers / 5.0) * 100))

    # 4. Inflow / Collection Cadence (10%)
    # Proportion of incoming cash compared to total velocity
    total_flow = total_jama + total_udhar
    if total_flow > 0:
        cadence_score = min(100, int((total_jama / total_flow) * 100))
    else:
        cadence_score = 50

    # Weighted raw score (0 to 100)
    raw_score = (
        (volume_score * 0.35) +
        (consistency_score * 0.35) +
        (diversity_score * 0.20) +
        (cadence_score * 0.10)
    )

    # Math Integrity Audit
    _, flags, integrity_multiplier = validate_ledger_math(transactions)
    adjusted_raw = raw_score * (0.85 + 0.15 * integrity_multiplier)

    # Map raw (0 to 100) to credit score range (300 to 850)
    score = int(300 + (adjusted_raw / 100.0) * 550)
    score = max(300, min(850, score))

    # Determine Grade, Risk Profile, and Recommended Loan Amount
    if score >= 720:
        grade = "A"
        risk_level = "Low Risk"
        max_loan = min(int(total_jama * 0.8), 50000)
        rec = f"Highly eligible for microloan up to ₹{max_loan:,} at 1.2% monthly interest with weekly flexible EMI."
    elif score >= 650:
        grade = "B+"
        risk_level = "Moderate Risk"
        max_loan = min(int(total_jama * 0.5), 30000)
        rec = f"Eligible for microloan up to ₹{max_loan:,} with daily micro-deduction repayment."
    elif score >= 550:
        grade = "B"
        risk_level = "Moderate Risk"
        max_loan = min(int(total_jama * 0.3), 15000)
        rec = f"Conditionally eligible for microloan up to ₹{max_loan:,} with bi-weekly check-ins."
    else:
        grade = "C"
        risk_level = "High Risk"
        max_loan = 5000
        rec = "Higher risk profile. Recommended for starter credit line up to ₹5,000."

    return {
        "score": score,
        "grade": grade,
        "risk_level": risk_level,
        "max_eligible_loan": max_loan,
        "factors": {
            "volume_score": volume_score,
            "consistency_score": consistency_score,
            "diversity_score": diversity_score,
            "cadence_score": cadence_score,
        },
        "recommendation": rec,
        "flags": flags,
    }
