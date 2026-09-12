// frontend/src/components/LenderDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Building2, Check, X, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';
import { fetchLenderLoans, submitLoanDecision } from '../services/lenderService';

const RISK_STYLES = {
  'Low Risk': 'bg-green-100 text-green-700',
  'Moderate Risk': 'bg-yellow-100 text-yellow-700',
  'High Risk': 'bg-red-100 text-red-700',
};

export default function LenderDashboard({ onInspectApplication }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLoans() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchLenderLoans();
        setLoans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadLoans();
  }, []);

  async function handleDecision(loanId, decision) {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: decision } : l))
    );
    try {
      await submitLoanDecision(loanId, decision);
      setActionNotice({ type: 'success', text: `Loan ${loanId} ${decision}.` });
    } catch (err) {
      setActionNotice({ type: 'error', text: `Failed to update ${loanId}: ${err.message}` });
    } finally {
      setTimeout(() => setActionNotice(null), 3000);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading applications…</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <ShieldAlert className="mx-auto mb-2" />
        Couldn't load loans: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
        <Building2 /> Lender Dashboard
      </h1>
      <p className="text-gray-500 mb-6">Review borrower applications and VeraScores.</p>

      {actionNotice && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            actionNotice.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {actionNotice.text}
        </div>
      )}

      <div className="grid gap-4">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition"
          >
            <div>
              <div className="font-semibold">{loan.merchant_name}</div>
              <div className="text-sm text-gray-500">
                {loan.business_type} · {loan.location}
              </div>
              <div className="text-sm mt-1">
                Requested: ₹{loan.requested_amount.toLocaleString()} · Monthly turnover: ₹
                {loan.monthly_turnover?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-1">{loan.applied_at}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 font-bold text-lg">
                  <Award size={18} /> {loan.verascore}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_STYLES[loan.risk_level]}`}>
                  {loan.risk_level}
                </span>
              </div>

              <button
                onClick={() => onInspectApplication?.(loan)}
                className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                Inspect <ArrowUpRight size={14} />
              </button>

              {loan.status === 'pending' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDecision(loan.id, 'approved')}
                    className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleDecision(loan.id, 'rejected')}
                    className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    loan.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {loan.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}