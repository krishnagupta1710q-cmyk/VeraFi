# Sample Data & Testing Guidelines 🧪

This directory contains test datasets and assets for testing and pitching **VeraFi**.

---

## 📂 Preloaded Test Cases

### 1. `kirana_store` (Healthy Profile)
- **Store**: Sharma Ji Kirana & General Store (Lucknow)
- **Business Type**: Retail grocery and household essentials.
- **Pattern**: Daily sales inflows (₹2,500 - ₹4,200), regular milk/inventory restocking outflows, 6 active recorded days.
- **Expected VeraScore**: **~745 (Grade A, Low Risk)**
- **Max Microloan Recommended**: **₹35,000**
- **Use Case in Pitch**: Shows how a consistent local store with 0 formal bank statements qualifies easily for a working capital loan.

---

### 2. `tea_stall` (Moderate Profile)
- **Store**: Raju Chai & Snacks Corner (Kanpur)
- **Business Type**: Tea and street snacks.
- **Pattern**: Smaller cash tickets, daily inventory purchases (milk, tea, sugar), 5 active recorded days.
- **Expected VeraScore**: **~685 (Grade B+, Moderate Risk)**
- **Max Microloan Recommended**: **₹20,000**
- **Use Case in Pitch**: Demonstrates daily micro-deduction repayment recommendation.

---

## 📸 Real Handwritten Photos
Teammate 3 can add high-resolution photos of handwritten paper ledgers or receipts into this folder:
- `sample_khatabook_1.jpg` (Hindi/English mix)
- `sample_receipt_1.jpg`

These can be tested against the live Gemini Vision endpoint (`POST /api/upload-ledger`).

