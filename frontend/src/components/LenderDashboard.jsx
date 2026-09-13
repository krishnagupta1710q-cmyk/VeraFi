import React, { useState, useEffect } from 'react';
import { Building2, Check, X, ShieldAlert, Award, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import { fetchLenderLoans, submitLoanDecision } from '../services/api';

export default function LenderDashboard({ onInspectApplication }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    async function loadLoans() {
      setLoading(true);
      const data = await fetchLenderLoans();
      setLoans(data);
      setLoading(false);
    }
    loadLoans();
  }, []);

  const handleDecision = async (loanId, action) => {
    const res = await submitLoanDecision(loanId, action);
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: action === 'approve' ? 'approved' : 'rejected' } : l))
    );
    setActionNotice({
      message: `Loan ${loanId} successfully ${action === 'approve' ? 'Approved & Disbursed' : 'Rejected'}!`,
      type: action === 'approve' ? 'success' : 'danger'
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const totalCapitalRequested = loans.reduce((acc, curr) => acc + (curr.requested_amount || 0), 0);
  const approvedCount = loans.filter((l) => l.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">MFI Loan Underwriting Portal</h2>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Institutional View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review alternative creditworthiness backed by verified handwritten cash ledgers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pipeline Capital</span>
            <p className="text-sm font-extrabold text-slate-900">₹{totalCapitalRequested.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Approved Loans</span>
            <p className="text-sm font-extrabold text-emerald-800">{approvedCount}</p>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* Loans Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Applicant Queue ({loans.length})
          </h3>
          <span className="text-xs text-slate-500">Live MFI Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Merchant Name</th>
                <th className="py-3 px-4">Category / Location</th>
                <th className="py-3 px-4">Requested</th>
                <th className="py-3 px-4">VeraScore</th>
                <th className="py-3 px-4">Risk Profile</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {loan.merchant_name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    <div>{loan.business_type}</div>
                    <div className="text-[10px] text-slate-400">{loan.location}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{loan.requested_amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {loan.verascore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        loan.verascore >= 700
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : loan.verascore >= 600
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {loan.risk_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        loan.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : loan.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {loan.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDecision(loan.id, 'approve')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(loan.id, 'reject')}
                          className="bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">Decision Recorded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

