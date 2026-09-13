/**
 * VeraFi API Service
 * Communicates with the FastAPI backend at localhost:8000
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function uploadLedgerImage(file) {
  if (!file) throw new Error('No file provided.');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-ledger`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Backend error ${response.status}: ${err}`);
  }

  return await response.json();
}

export async function fetchLenderLoans() {
  const response = await fetch(`${API_BASE_URL}/loans`);
  if (!response.ok) throw new Error(`Failed to fetch loans: ${response.status}`);
  return await response.json();
}

export async function submitLoanDecision(loanId, action = 'approve') {
  const response = await fetch(`${API_BASE_URL}/loans/${loanId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) throw new Error(`Failed to submit decision: ${response.status}`);
  return await response.json();
}
