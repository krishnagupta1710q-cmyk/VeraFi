# VeraFi — Lender API Contract

Agreed shape between frontend (Lender Dashboard) and backend (FastAPI).
Any change here needs both sides' sign-off.

## GET /api/lender/loans

Returns list of loan applications.

```json
[
  {
    "id": "loan_001",
    "borrowerName": "Rekha Devi",
    "businessType": "Vegetable Vendor",
    "requestedAmount": 15000,
    "veraScore": 690,
    "riskLevel": "low",
    "status": "pending",
    "submittedDate": "2026-09-01",
    "ledgerImageUrl": "/uploads/ledger_001.jpg",
    "scoreBreakdown": { "volume": 80, "consistency": 75, "diversity": 60, "repayment": 90 },
    "transactions": [
      { "date": "2026-08-28", "type": "credit", "amount": 500, "party": "Ramesh" }
    ]
  }
]
```

## POST /api/lender/loans/:id/decision

Request body:
```json
{ "decision": "approved", "note": "optional string" }
```

Response:
```json
{ "id": "loan_001", "status": "approved" }
```

## Notes
- `riskLevel` values: `low` | `medium` | `high`
- `status` values: `pending` | `approved` | `rejected`
- `veraScore` range: 300–850