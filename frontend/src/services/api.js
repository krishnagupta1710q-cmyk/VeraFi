/**
 * VeraFi API Service
 * Handles communication with backend, with seamless fallback to mockData.
 */

import { SAMPLE_DATASETS, INITIAL_LENDER_LOANS } from '../mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function uploadLedgerImage(file, sampleKey = null) {
  // Quick demo sample buttons — return instantly without hitting backend
  if (sampleKey && SAMPLE_DATASETS[sampleKey]) {
    return SAMPLE_DATASETS[sampleKey];
  }

  // Real file upload — try backend first
  if (file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload-ledger`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[VeraFi] Backend response received:', data);
        return data;
      } else {
        console.warn(`[VeraFi] Backend returned ${response.status}. Using mock fallback.`);
      }
    } catch (err) {
      console.warn('[VeraFi] Backend offline. Using mock data for demo.', err.message);
    }

    // Backend offline fallback — use tea_stall so data visibly changes
    return {
      ...SAMPLE_DATASETS.tea_stall,
      merchant_name: file.name.replace(/\.[^.]+$/, '') + ' (Demo Data)',
    };
  }

  // No file and no sampleKey — return default
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

