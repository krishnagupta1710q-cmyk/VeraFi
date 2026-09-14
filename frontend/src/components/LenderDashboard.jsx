import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, ChevronRight, Download, Check, X, Building2 } from 'lucide-react';
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
      <div className="bg-paper p-6 border-2 border-ink shadow-vintage flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-ink">MFI Loan Underwriting Portal</h2>
            <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 border-2 border-brand-700 uppercase tracking-wider">
              Institutional View
            </span>
          </div>
          <p className="text-xs font-mono text-ink-light mt-1">
            Review alternative creditworthiness backed by verified handwritten cash ledgers.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex items-center gap-3">
          <div className="bg-paper-dark border-2 border-ink px-3 py-2 shadow-[2px_2px_0px_rgba(44,42,37,1)] text-right">
            <span className="text-[10px] uppercase font-bold font-mono text-ink-light tracking-wider">Pipeline Capital</span>
            <p className="text-sm font-serif font-bold text-ink">₹{totalCapitalRequested.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-brand-50 border-2 border-brand-600 px-3 py-2 shadow-[2px_2px_0px_rgba(58,99,71,1)] text-right">
            <span className="text-[10px] uppercase font-bold font-mono text-brand-700 tracking-wider">Approved Loans</span>
            <p className="text-sm font-serif font-bold text-brand-700">{approvedCount}</p>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div
          className={`p-4 text-xs font-mono font-bold flex items-center gap-2 border-2 shadow-vintage ${
            actionNotice.type === 'success'
              ? 'bg-brand-50 text-brand-700 border-brand-600'
              : 'bg-vintage-red/10 text-vintage-red border-vintage-red'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* Loans Table */}
      <div className="bg-paper border-2 border-ink shadow-vintage overflow-hidden">
        <div className="p-4 border-b-2 border-ink bg-paper-dark flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono text-ink uppercase tracking-wider">
            Applicant Queue ({loans.length})
          </h3>
          <span className="text-xs font-mono text-ink-light">Live MFI Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-paper-dark text-ink font-bold border-b-2 border-ink">
              <tr>
                <th className="py-3 px-4 border-r-2 border-ink">Merchant Name</th>
                <th className="py-3 px-4 border-r-2 border-ink">Category / Location</th>
                <th className="py-3 px-4 border-r-2 border-ink">Requested</th>
                <th className="py-3 px-4 border-r-2 border-ink">VeraScore</th>
                <th className="py-3 px-4 border-r-2 border-ink">Risk Profile</th>
                <th className="py-3 px-4 border-r-2 border-ink">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink text-ink bg-paper">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-paper-light transition-colors">
                  <td className="py-3.5 px-4 font-bold font-serif text-ink border-r-2 border-ink">
                    {loan.merchant_name}
                  </td>
                  <td className="py-3.5 px-4 text-ink-light border-r-2 border-ink">
                    <div className="font-bold">{loan.business_type}</div>
                    <div className="text-[10px] text-ink-light/80">{loan.location}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-ink border-r-2 border-ink font-serif text-sm">
                    ₹{loan.requested_amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 border-r-2 border-ink">
                    <span className="inline-flex items-center gap-1 font-bold text-ink bg-vintage-gold/20 px-2 py-0.5 border-2 border-ink">
                      <Award className="w-3.5 h-3.5 text-vintage-gold" />
                      {loan.verascore}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 border-r-2 border-ink">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold border-2 uppercase tracking-wider ${
                        loan.verascore >= 700
                          ? 'bg-brand-50 text-brand-700 border-brand-600'
                          : loan.verascore >= 600
                          ? 'bg-vintage-gold/20 text-ink border-ink'
                          : 'bg-vintage-red/10 text-vintage-red border-vintage-red'
                      }`}
                    >
                      {loan.risk_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 border-r-2 border-ink">
                    <span
                      className={`uppercase tracking-wider px-2 py-0.5 text-[11px] font-bold border-2 ${
                        loan.status === 'approved'
                          ? 'bg-brand-100 text-brand-800 border-brand-600'
                          : loan.status === 'rejected'
                          ? 'bg-vintage-red/10 text-vintage-red border-vintage-red'
                          : 'bg-paper-dark text-ink border-ink'
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
                          className="bg-brand-600 hover:bg-brand-700 text-paper font-bold px-2.5 py-1 text-xs flex items-center gap-1 transition-all border-2 border-ink shadow-[1px_1px_0px_rgba(44,42,37,1)]"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(loan.id, 'reject')}
                          className="bg-paper-dark hover:bg-vintage-red/10 text-ink hover:text-vintage-red border-2 border-ink font-bold px-2.5 py-1 text-xs flex items-center gap-1 transition-all shadow-[1px_1px_0px_rgba(44,42,37,1)]"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-ink-light uppercase">Decision Recorded</span>
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
