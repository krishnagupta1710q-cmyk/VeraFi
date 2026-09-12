"""
VeraFi Ledger Math Validator & Anomaly Detector
-----------------------------------------------
Audits handwritten ledger entries for mathematical consistency.
Detects altered values, duplicate records, and running balance mismatches.
"""

from typing import List, Dict, Any


def validate_ledger_math(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Checks if recorded transactions add up mathematically.

    Returns:
        dict: {
            "is_valid": bool,
            "integrity_score": int (0 to 100),
            "discrepancies": List[str],
            "calculated_net": float,
            "flagged_entries": List[str]
        }
    """
    if not transactions:
        return {
            "is_valid": True,
            "integrity_score": 100,
            "discrepancies": [],
            "calculated_net": 0.0,
            "flagged_entries": []
        }

    running_balance = 0.0
    discrepancies = []
    flagged_entries = []
    seen_signatures = set()

    for idx, tx in enumerate(transactions, start=1):
        amount = float(tx.get("amount", 0.0))
        tx_type = str(tx.get("type", "jama")).lower()
        recorded_balance = tx.get("balance")
        tx_date = tx.get("date", "Unknown")
        customer = tx.get("customer_name", "Customer")

        # 1. Update running balance
        if tx_type == "jama":
            running_balance += amount
        elif tx_type == "udhar":
            running_balance -= amount

        # 2. Check against recorded balance if present
        if recorded_balance is not None:
            try:
                rec_bal = float(recorded_balance)
                diff = abs(running_balance - rec_bal)
                if diff > 10.0:  # Allow minor rounding tolerance
                    msg = (
                        f"Entry #{idx} ({tx_date} - {customer}): Recorded balance ₹{rec_bal:,.0f} "
                        f"differs from calculated ₹{running_balance:,.0f} (Mismatch: ₹{diff:,.0f})"
                    )
                    discrepancies.append(msg)
                    flagged_entries.append(tx.get("id", f"tx_{idx}"))
            except (ValueError, TypeError):
                pass

        # 3. Detect duplicate entries
        sig = (tx_date, customer.strip().lower(), amount, tx_type)
        if sig in seen_signatures:
            discrepancies.append(
                f"Duplicate entry flagged: ₹{amount:,.0f} {tx_type} for '{customer}' on {tx_date}"
            )
            flagged_entries.append(tx.get("id", f"tx_{idx}"))
        else:
            seen_signatures.add(sig)

    # 4. Calculate integrity score (100 minus 15 per issue, minimum 20)
    penalty = len(discrepancies) * 15
    integrity_score = max(20, 100 - penalty)
    is_valid = len(discrepancies) == 0

    return {
        "is_valid": is_valid,
        "integrity_score": integrity_score,
        "discrepancies": discrepancies,
        "calculated_net": running_balance,
        "flagged_entries": flagged_entries
    }
