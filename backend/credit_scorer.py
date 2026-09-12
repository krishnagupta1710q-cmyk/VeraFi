"""
VeraFi Credit Scoring Engine (VeraScore™)
----------------------------------------
Calculates an alternative credit score (300 to 850) for unbanked
merchants based on cash flow velocity, business consistency,
customer diversity, repayment cadence, and ledger integrity.
"""

from typing import List, Dict, Any
from validator import validate_ledger_math


def calculate_volume_score(inflow: float, requested_amount: float = 25000.0) -> float:
    """Evaluates cash inflow relative to requested microloan (0-100)."""
    if requested_amount <= 0:
        requested_amount = 25000.0
    ratio = inflow / (requested_amount * 1.5)
    score = min(ratio * 100.0, 100.0)
    return round(max(score, 10.0), 1)


def calculate_consistency_score(transactions: List[Dict[str, Any]]) -> float:
    """Measures regular business activity across distinct dates (0-100)."""
    if not transactions:
        return 20.0
    dates = {str(tx.get("date")) for tx in transactions if tx.get("date")}
    score = min((len(dates) / 6.0) * 100.0, 100.0)
    return round(max(score, 25.0), 1)


def calculate_diversity_score(transactions: List[Dict[str, Any]]) -> float:
    """Measures counterparty diversity across unique named customers (0-100)."""
    if not transactions:
        return 20.0
    customers = set()
    for tx in transactions:
        name = str(tx.get("customer_name", "")).strip().lower()
        if name and name not in ["cash", "counter", "unknown", "none", ""]:
            customers.add(name)
    score = min((len(customers) / 5.0) * 100.0, 100.0)
    return round(max(score, 30.0), 1)


def calculate_cadence_score(transactions: List[Dict[str, Any]]) -> float:
    """Evaluates the ratio of inflow (Jama) to total turnover (0-100)."""
    total_inflow = sum(float(tx.get("amount", 0)) for tx in transactions if tx.get("type") == "jama")
    total_outflow = sum(float(tx.get("amount", 0)) for tx in transactions if tx.get("type") == "udhar")
    turnover = total_inflow + total_outflow
    if turnover <= 0:
        return 30.0
    ratio = total_inflow / turnover
    score = min((ratio / 0.6) * 100.0, 100.0)
    return round(max(score, 20.0), 1)


def compute_verascore(
    transactions: List[Dict[str, Any]],
    requested_amount: float = 25000.0
) -> Dict[str, Any]:
    """
    Synthesizes cash flow indicators and ledger integrity into a VeraScore (300 - 850).
    """
    inflow = sum(float(tx.get("amount", 0)) for tx in transactions if tx.get("type") == "jama")
    outflow = sum(float(tx.get("amount", 0)) for tx in transactions if tx.get("type") == "udhar")

    # 1. Audit ledger math integrity
    math_report = validate_ledger_math(transactions)

    # 2. Compute 4-pillar subscores
    vol = calculate_volume_score(inflow, requested_amount)
    cons = calculate_consistency_score(transactions)
    div = calculate_diversity_score(transactions)
    cad = calculate_cadence_score(transactions)

    # 3. Weighted raw aggregate (0 to 100)
    raw_score = (vol * 0.35) + (cons * 0.35) + (div * 0.20) + (cad * 0.10)

    # 4. Deduct integrity penalty if math discrepancies were found
    penalty = (100 - math_report["integrity_score"]) * 0.4
    raw_score = max(10.0, raw_score - penalty)

    # 5. Scale to standard credit score range (300 to 850)
    final_score = int(300 + (raw_score / 100.0) * 550)
    final_score = max(300, min(850, final_score))

    # 6. Determine risk tier & loan recommendation
    if final_score >= 720:
        grade = "A"
        risk_level = "Low Risk"
        max_loan = round(inflow * 0.8, -2)
        recommendation = f"Highly eligible for low-interest microloan up to ₹{int(max_loan):,} at ~1.2% per month."
    elif final_score >= 620:
        grade = "B"
        risk_level = "Moderate Risk"
        max_loan = round(inflow * 0.5, -2)
        recommendation = f"Eligible for microloan up to ₹{int(max_loan):,} with weekly repayment schedule."
    else:
        grade = "C"
        risk_level = "High Risk"
        max_loan = round(inflow * 0.25, -2)
        recommendation = f"Eligible for starter credit builder microloan up to ₹{int(max_loan):,}."

    flags = []
    if outflow > inflow:
        flags.append("Negative net cash flow in recorded period")
    if len(transactions) < 4:
        flags.append("Limited transaction history recorded")
    flags.extend(math_report["discrepancies"])

    return {
        "score": final_score,
        "grade": grade,
        "risk_level": risk_level,
        "max_eligible_loan": int(max(max_loan, 5000)),
        "integrity_score": math_report["integrity_score"],
        "factors": {
            "volume_score": int(vol),
            "consistency_score": int(cons),
            "diversity_score": int(div),
            "cadence_score": int(cad)
        },
        "recommendation": recommendation,
        "flags": flags
    }
