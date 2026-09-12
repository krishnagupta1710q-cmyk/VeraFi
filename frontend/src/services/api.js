/**
 * VeraFi API Service
 * Handles communication with backend, with seamless fallback to mockData.
 */

import { SAMPLE_DATASETS, INITIAL_LENDER_LOANS } from '../mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// In-memory cache to sync state across mock requests during a single session
let localLoansCache = [...INITIAL_LENDER_LOANS];

/**
 * Upload ledger image or fetch preloaded sample dataset.
 */
export async function uploadLedgerImage(file = null, sampleKey = null) {
  if (sampleKey && SAMPLE_DATASETS[sampleKey]) {
    return SAMPLE_DATASETS[sampleKey];
  }

  if (file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload-ledger`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Backend not detected. Using client-side mock fallback.', err);
    }
  }

  return SAMPLE_DATASETS.kirana_store;
}

/**
 * Fetch loan applications queue for lenders.
 */
export async function fetchLenderLoans() {
  try {
    const response = await fetch(`${API_BASE_URL}/loans`);
    if (response.ok) {
      const data = await response.json();
      localLoansCache = data;
      return data;
    }
  } catch (err) {
    console.warn('Backend not detected. Serving local loan state.', err);
  }

  return localLoansCache;
}

/**
 * Submit lender decision (Approve / Reject) for a loan application.
 */
export async function submitLoanDecision(loanId, action = 'approve') {
  const normalizedAction = action.toLowerCase();
  const targetStatus = normalizedAction === 'approve' ? 'Approved' : 'Rejected';

  try {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: normalizedAction }),
    });

    if (response.ok) {
      const result = await response.json();
      // Update local cache to match backend state
      localLoansCache = localLoansCache.map((loan) =>
        loan.id === loanId ? { ...loan, status: targetStatus } : loan
      );
      return result;
    }
  } catch (err) {
    console.warn(`Backend offline. Simulating ${normalizedAction} locally.`);
  }

  // Update in-memory fallback state so UI stays in sync when offline
  localLoansCache = localLoansCache.map((loan) =>
    loan.id === loanId ? { ...loan, status: targetStatus } : loan
  );

  return {
    success: true,
    loan_id: loanId,
    status: targetStatus,
    message: `Loan ${targetStatus} (Offline Simulation)`,
  };
}
