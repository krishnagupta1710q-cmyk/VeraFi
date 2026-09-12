# VeraFi Test Samples 🧪

This directory contains realistic test assets and datasets for testing and pitching **VeraFi**.

---

## 📸 Test Images for Drag-and-Drop / Upload

You can upload these images directly in the VeraFi frontend or via `POST /api/upload-ledger`:

### 1. `sample_khatabook_1.jpg`
- **Type**: Physical handwritten *Bahi-Khata* ledger notebook.
- **Details**: Ruled notebook paper with columns for Date (दिनांक), Particulars (विवरण - Rakesh, Atta, Suresh, Dal, Sharma Ji), Jama/Credit (जमा), Udhar/Debit (उधार), and Running Balance (बकाया).
- **Ideal For**: Testing dual-entry ledger extraction and math consistency verification.

### 2. `sample_receipt_1.jpg`
- **Type**: Handwritten grocery cash memo receipt from *Gupta General Store*.
- **Details**: Serial number #1489, dated bill, line items (Sugar, Basmati Rice, Fortune Oil, Atta, Moong Dal), total amount (₹2,205), PAID stamp, and merchant signature.
- **Ideal For**: Testing single-receipt invoice OCR extraction.

---

## ⚡ Built-in 1-Click UI Samples

In the web application, you can also test without dragging any files by clicking the quick demo buttons at the top of the upload box:
- **Kirana Store Sample** $\rightarrow$ Sharma Ji Kirana Store (healthy credit profile, 736 VeraScore).
- **Chai Stall Sample** $\rightarrow$ Raju Chai Corner (daily street vendor profile, 685 VeraScore).
