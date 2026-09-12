// frontend/src/services/lenderService.js
import { mockLoans } from '../mockData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true; // backend ready hone pe false karna

export async function fetchLenderLoans() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return mockLoans;
  }

  const res = await fetch(`${API_BASE}/api/lender/loans`);
  if (!res.ok) throw new Error(`Failed to fetch loans (${res.status})`);
  return res.json();
}

export async function submitLoanDecision(loanId, decision, note = '') {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { id: loanId, status: decision };
  }

  const res = await fetch(`${API_BASE}/api/lender/loans/${loanId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision, note }),
  });
  if (!res.ok) throw new Error(`Failed to submit decision (${res.status})`);
  return res.json();
}