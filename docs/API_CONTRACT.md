# VeraFi — API Contract & Shared Data Specification 📋

This document defines the shared JSON contracts between the **Backend** (FastAPI / AI) and **Frontend** (React). Both frontend and backend developers can develop independently against this specification.

---

## 1. Upload & Extract Ledger
**Endpoint:** `POST /api/upload-ledger`  
**Content-Type:** `multipart/form-data`

### Request Parameters
| Field | Type | Description |
| :--- | :--- | :--- |
| `file` | File (image) | JPEG/PNG/WebP photo of handwritten ledger or receipt. |
| `sample_id` | string (optional) | ID of pre-loaded sample (e.g., `kirana_store_1`, `tea_stall_1`). |

### Response (`200 OK`)
```json
{
  "ledger_id": "ledg_8912739",
  "merchant_name": "Sharma Ji Kirana Store",
  "period": "Aug 2026",
  "currency": "INR",
  "summary": {
    "total_inflow": 42500,
    "total_outflow": 28400,
    "net_balance": 14100,
    "total_transactions": 8,
    "active_days": 6
  },
  "transactions": [
    {
      "id": "tx_1",
      "date": "2026-08-01",
      "customer_name": "Ramesh Kumar",
      "type": "jama", 
      "amount": 2500,
      "balance": 2500,
      "category": "sales",
      "note": "Rice & Atta 25kg"
    },
    {
      "id": "tx_2",
      "date": "2026-08-02",
      "customer_name": "Gupta Dairy",
      "type": "udhar",
      "amount": 1200,
      "balance": 1300,
      "category": "inventory",
      "note": "Milk & Ghee crate"
    }
  ],
  "verascore": {
    "score": 745,
    "grade": "A",
    "risk_level": "Low Risk",
    "max_eligible_loan": 35000,
    "factors": {
      "volume_score": 82,
      "consistency_score": 78,
      "diversity_score": 70,
      "cadence_score": 68
    },
    "recommendation": "Eligible for microloan up to ₹35,000 at 1.2% monthly interest.",
    "flags": []
  }
}
```

> **Note on Transaction Types:**
> - `"jama"` = Credit / Inflow / Money received by shopkeeper.
> - `"udhar"` = Debit / Outflow / Credit extended to customer or inventory payment.

---

## 2. Calculate Credit Score Standalone
**Endpoint:** `POST /api/calculate-score`  
**Content-Type:** `application/json`

### Request Body
```json
{
  "transactions": [ ... ],
  "requested_amount": 25000
}
```

### Response (`200 OK`)
Returns the `verascore` object defined above.

---

## 3. Lender: Get Loan Applications
**Endpoint:** `GET /api/loans`  
**Content-Type:** `application/json`

### Response (`200 OK`)
```json
[
  {
    "id": "loan_101",
    "merchant_name": "Sharma Ji Kirana Store",
    "business_type": "Grocery & Daily Needs",
    "location": "Lucknow, UP",
    "requested_amount": 25000,
    "verascore": 745,
    "risk_level": "Low Risk",
    "monthly_turnover": 42500,
    "status": "pending",
    "applied_at": "2026-09-02T10:30:00Z",
    "ledger_id": "ledg_8912739"
  }
]
```

---

## 4. Lender: Approve / Reject Loan
**Endpoint:** `POST /api/loans/{id}/action`  
**Content-Type:** `application/json`

### Request Body
```json
{
  "action": "approve", // or "reject"
  "approved_amount": 25000,
  "interest_rate_monthly": 1.2,
  "tenure_months": 3
}
```

### Response (`200 OK`)
```json
{
  "success": true,
  "loan_id": "loan_101",
  "status": "approved",
  "disbursed": true,
  "message": "Loan successfully approved and ready for instant disbursement."
}
```

