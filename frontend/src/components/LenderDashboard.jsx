import React, { useState, useEffect } from 'react';
import { Landmark, Check, X, Award, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchLenderLoans, submitLoanDecision } from '../services/api';

export default function LenderDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const loadLoans = async () => {
    setLoading(true);
    try {
      const data = await fetchLenderLoans();
      setLoans(data || []);
    } catch (err) {
      console.warn('Could not fetch loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleDecision = async (loanId, action) => {
    try {
      await submitLoanDecision(loanId, action);
      setLoans((prev) =>
        prev.map((l) => (l.id === loanId ? { ...l, status: action === 'approve' ? 'approved' : 'rejected' } : l))
      );
      setActionNotice({
        message: `Loan ${loanId} successfully ${action === 'approve' ? 'APPROVED & DISBURSED' : 'REJECTED'}!`,
        type: action === 'approve' ? 'success' : 'danger',
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  const totalCapitalRequested = loans.reduce((acc, curr) => acc + (curr.requested_amount || 0), 0);
  const approvedCount = loans.filter((l) => l.status === 'approved').length;
  const approvedCapital = loans
    .filter((l) => l.status === 'approved')
    .reduce((acc, curr) => acc + (curr.approved_amount || curr.requested_amount || 0), 0);

  const filteredLoans = loans.filter((l) => {
    if (filterStatus === 'all') return true;
    return l.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Vintage Institutional Ledger Desk */}
      <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border-2 border-[#D8C7B0] shadow-xl ledger-paper">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b-2 border-[#E7DECD]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold font-serif-vintage text-stone-900 tracking-wide">
                MFI Underwriting & Disbursement Registry
              </h2>
              <span className="stamp-seal stamp-verified text-[10px]">
                Institutional Ledger
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 font-serif-vintage">
              Review unbanked merchant applications backed by verified physical cashbook velocity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLoans}
            className="self-start md:self-auto text-xs bg-[#FAF6EE] hover:bg-[#F0E6D6] text-stone-700 font-bold px-3.5 py-2 rounded-xl border border-stone-300 flex items-center gap-1.5 transition-all shadow-sm font-serif-vintage"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Vintage Accounting Stats Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#FAF6EE] border-2 border-stone-300 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block font-serif-vintage">
              Total Requested Pipeline
            </span>
            <p className="text-2xl font-bold font-ledger-mono text-stone-900 mt-1">
              ₹{totalCapitalRequested.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Across {loans.length} registered borrowers
            </span>
          </div>

          <div className="bg-[#F3F9F5] border-2 border-[#15803D]/30 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#15803D] block font-serif-vintage">
              Approved Microloans
            </span>
            <p className="text-2xl font-bold font-ledger-mono text-[#15803D] mt-1">
              {approvedCount} Loans
            </p>
            <span className="text-[11px] text-[#15803D]/80 mt-0.5 block">
              100% Zero Property Collateral
            </span>
          </div>

          <div className="bg-[#FAF6EE] border-2 border-stone-300 p-4 rounded-xl">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block font-serif-vintage">
              Disbursed Capital
            </span>
            <p className="text-2xl font-bold font-ledger-mono text-stone-900 mt-1">
              ₹{approvedCapital.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Average interest: 1.2%/month
            </span>
          </div>
        </div>
      </div>

      {/* Decision Notice Toast */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl text-xs font-bold font-serif-vintage tracking-wider flex items-center gap-3 border-2 transition-all shadow-md ${
            actionNotice.type === 'success'
              ? 'bg-[#EBF7EE] text-[#15803D] border-[#15803D]'
              : 'bg-[#FFF0F0] text-[#8B261E] border-[#8B261E]'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* Loan Registry Journal */}
      <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#D8C7B0] shadow-xl overflow-hidden ledger-paper">
        
        {/* Table Filter Tabs */}
        <div className="p-4 sm:p-5 border-b-2 border-[#E7DECD] bg-[#FAF4EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold font-serif-vintage text-stone-900 uppercase tracking-wider">
              Borrower Applications ({filteredLoans.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#EFE7D8] p-1 rounded-xl border border-stone-300 text-xs">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg capitalize font-bold font-serif-vintage transition-all ${
                  filterStatus === st
                    ? 'bg-[#8B261E] text-amber-100 shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7EFE1] text-stone-800 font-bold border-b-2 border-[#D8C7B0] font-serif-vintage">
              <tr>
                <th className="py-3 px-4">Merchant Name</th>
                <th className="py-3 px-4">Category & City</th>
                <th className="py-3 px-4 text-right">Requested</th>
                <th className="py-3 px-4 text-center">VeraScore™</th>
                <th className="py-3 px-4">Risk Profile</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Underwriting Stamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEDEC9] text-stone-800">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => {
                  const isApproved = loan.status === 'approved';
                  const isRejected = loan.status === 'rejected';

                  return (
                    <tr key={loan.id} className="hover:bg-[#FAF3E7] transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold font-serif-vintage text-stone-900 text-sm">
                        {loan.merchant_name}
                      </td>

                      {/* Business & City */}
                      <td className="py-3.5 px-4 text-stone-600">
                        <div className="font-medium text-stone-900">{loan.business_type}</div>
                        <div className="text-[10px] text-stone-500 font-mono">{loan.location}</div>
                      </td>

                      {/* Requested Amount */}
                      <td className="py-3.5 px-4 font-ledger-mono font-bold text-right text-sm text-stone-900">
                        ₹{(loan.requested_amount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* VeraScore */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold font-ledger-mono text-stone-900 bg-[#FAF4EB] px-2.5 py-1 rounded-lg border border-stone-300">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          {loan.verascore}
                        </span>
                      </td>

                      {/* Risk Tier */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`stamp-seal text-[9px] py-0.5 px-2 ${
                            loan.verascore >= 700
                              ? 'border-[#15803D] text-[#15803D]'
                              : loan.verascore >= 600
                              ? 'border-amber-700 text-amber-700'
                              : 'border-[#8B261E] text-[#8B261E]'
                          }`}
                        >
                          {loan.risk_level || 'Moderate Risk'}
                        </span>
                      </td>

                      {/* Status Stamp */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`stamp-seal text-[10px] py-0.5 px-2.5 ${
                            isApproved
                              ? 'stamp-approved font-bold'
                              : isRejected
                              ? 'stamp-verified font-bold'
                              : 'border-stone-400 text-stone-600'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isApproved ? (
                          <span className="text-[11px] font-bold text-[#15803D] font-serif-vintage">
                            ✓ Disbursed
                          </span>
                        ) : isRejected ? (
                          <span className="text-[11px] font-bold text-[#8B261E] font-serif-vintage">
                            Declined
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDecision(loan.id, 'approve')}
                              className="px-3 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#126832] text-white text-xs font-bold font-serif-vintage flex items-center gap-1 shadow-sm transition-all"
                              title="Approve & Disburse Microloan"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDecision(loan.id, 'reject')}
                              className="px-2.5 py-1.5 rounded-lg border border-[#8B261E] text-[#8B261E] hover:bg-[#FFF2F2] text-xs font-bold font-serif-vintage flex items-center gap-1 transition-all"
                              title="Reject Application"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 font-serif-vintage">
                    No loan applications matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
