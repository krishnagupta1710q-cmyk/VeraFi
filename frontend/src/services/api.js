/**
 * VeraFi API Service
 * Handles communication with backend, with seamless fallback to mockData.
 */

import { SAMPLE_DATASETS, INITIAL_LENDER_LOANS } from '../mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function uploadLedgerImage(file, sampleKey = null) {
  // If user selected a quick preloaded sample or didn't upload a file
  if (sampleKey && SAMPLE_DATASETS[sampleKey]) {
    return SAMPLE_DATASETS[sampleKey];
  }

  // Attempt real backend call
  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(`${API_BASE_URL}/upload-ledger`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend not detected. Using client-side mock data fallback.', err);
  }

  // Fallback to default mock dataset
  return SAMPLE_DATASETS.kirana_store;
}

export async function fetchLenderLoans() {
  try {
    const response = await fetch(`${API_BASE_URL}/loans`);
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend not detected. Using mock loan applications.', err);
  }
  return INITIAL_LENDER_LOANS;
}

export async function submitLoanDecision(loanId, action = 'approve') {
  try {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn('Backend offline. Simulating approval locally.');
  }

  return {
    success: true,
    loan_id: loanId,
    status: action === 'approve' ? 'approved' : 'rejected',
    message: `Loan ${action === 'approve' ? 'Approved' : 'Rejected'} (Offline Simulation)`
  };
}

