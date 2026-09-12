"""
VeraFi Credit Scoring Engine (VeraScore™)
----------------------------------------
Assigned to: Role 1 (Frontend + Credit Scoring Logic)

This module calculates an alternative credit score (300 to 850) for unbanked
and informal merchants based on physical ledger transactions (Jama/Udhar).
"""

from typing import List, Dict, Any
from datetime import datetime


def calculate_volume_score(inflow: float, requested_amount: float = 25000.0) -> float:
    """
    Evaluates cash inflow relative to benchmark/requested microloan.
    Returns a normalized sub-score from 0 to 100.
    """
    if requested_amount <= 0:
        requested_amount = 25000.0
    
    # Target: Merchant should generate at least 1.5x of the loan in monthly inflow
    ratio = inflow / (requested_amount * 1.5)
    score = min(ratio * 100, 100.0)
    return round(max(score, 10.0), 1)


def calculate_consistency_score(transactions: List[Dict[str, Any]]) -> float:
    """
    Measures regular business activity across distinct dates.
    More active days = higher consistency.
    """
    if not transactions:
        return 20.0

    dates = set()
    for tx in transactions:
        d = tx.get("date")
        if d:
            dates.add(str(d))

    distinct_days = len(dates)
    # Benchmark: 5+ active recorded days in sample ledger is high consistency
    score = min((distinct_days / 6.0) * 100.0, 100.0)
    return round(max(score, 25.0), 1)


def calculate_diversity_score(transactions: List[Dict[str, Any]]) -> float:
    """
    Measures counterparty diversity.
    A shopkeeper serving multiple unique customers is less risky than relying on one.
    """
    if not transactions:
        return 20.0

    customers = set()
    for tx in transactions:
        name = tx.get("customer_name")
        if name and name.strip().lower() not in ["cash", "counter", "unknown", ""]:
            customers.add(name.strip().lower())

    count = len(customers)
    # Benchmark: 4+ distinct named customers in sample
    score = min((count / 5.0) * 100.0, 100.0)
    return round(max(score, 30.0), 1)


def calculate_cadence_score(transactions: List[Dict[str, Any]]) -> float:
    """
    Evaluates the ratio of inflow (Jama) vs total turnover.
    High collection rates signify healthy liquidity.
    """
    total_inflow = sum(tx.get("amount", 0) for tx in transactions if tx.get("type") == "jama")
    total_outflow = sum(tx.get("amount", 0) for tx in transactions if tx.get("type") == "udhar")
    turnover = total_inflow + total_outflow

    if turnover <= 0:
        return 30.0

    inflow_ratio = total_inflow / turnover
    # Ideal: inflow makes up 50% to 75% of total movement (balanced cashflow)
    score = min((inflow_ratio / 0.6) * 100.0, 100.0)
    return round(max(score, 20.0), 1)


def compute_verascore(
    transactions: List[Dict[str, Any]], 
    requested_amount: float = 25000.0
) -> Dict[str, Any]:
    """
    Synthesizes the four pillars into a final VeraScore (300 - 850).
    Formula:
        Raw Score (0-100) = (Volume * 0.35) + (Consistency * 0.35) + 
                            (Diversity * 0.20) + (Cadence * 0.10)
        VeraScore = 300 + (Raw Score / 100) * 550
    """
    inflow = sum(tx.get("amount", 0) for tx in transactions if tx.get("type") == "jama")
    outflow = sum(tx.get("amount", 0) for tx in transactions if tx.get("type") == "udhar")

    # Calculate sub-factor scores (each 0 - 100)
    vol = calculate_volume_score(inflow, requested_amount)
    cons = calculate_consistency_score(transactions)
    div = calculate_diversity_score(transactions)
    cad = calculate_cadence_score(transactions)

    # Weighted aggregate (0 to 100)
    raw_score = (vol * 0.35) + (cons * 0.35) + (div * 0.20) + (cad * 0.10)

    # Scale to standard credit score range (300 to 850)
    final_score = int(300 + (raw_score / 100.0) * 550)
    final_score = max(300, min(850, final_score))

    # Grade & Risk Level
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

    return {
        "score": final_score,
        "grade": grade,
        "risk_level": risk_level,
        "max_eligible_loan": int(max(max_loan, 5000)),
        "factors": {
            "volume_score": int(vol),
            "consistency_score": int(cons),
            "diversity_score": int(div),
            "cadence_score": int(cad)
        },
        "recommendation": recommendation,
        "flags": flags
    }


# Standalone self-test for Role 1
if __name__ == "__main__":
    sample_txs = [
        {"date": "2026-08-01", "customer_name": "Ramesh Kumar", "type": "jama", "amount": 2500},
        {"date": "2026-08-02", "customer_name": "Gupta Dairy", "type": "udhar", "amount": 1200},
        {"date": "2026-08-03", "customer_name": "Anita Devi", "type": "jama", "amount": 3400},
        {"date": "2026-08-04", "customer_name": "Suresh Chai", "type": "jama", "amount": 1800},
        {"date": "2026-08-05", "customer_name": "Wholesale Mandi", "type": "udhar", "amount": 4000},
        {"date": "2026-08-06", "customer_name": "Vikram Singh", "type": "jama", "amount": 2900},
    ]
    result = compute_verascore(sample_txs, requested_amount=20000)
    print("Self Test VeraScore Result:")
    import json
    print(json.dumps(result, indent=2))

