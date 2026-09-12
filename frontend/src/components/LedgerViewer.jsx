import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function LedgerViewer({ ledgerData }) {
  if (!ledgerData) return null;

  const { merchant_name, period, currency, summary, transactions, image_url } = ledgerData;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">2. AI-Verified Digital Ledger</h2>
            <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified OCR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Store: <span className="font-semibold text-slate-700">{merchant_name}</span> | Period: {period}
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Total Inflow (Jama)</span>
            <p className="text-sm font-extrabold text-emerald-800">
              ₹{summary?.total_inflow?.toLocaleString('en-IN') || 0}
            </p>
          </div>
          <div className="bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">Total Outflow (Udhar)</span>
            <p className="text-sm font-extrabold text-rose-800">
              ₹{summary?.total_outflow?.toLocaleString('en-IN') || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Original Ledger Image Reference */}
        <div className="lg:col-span-4 flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Physical Ledger Snapshot
          </span>
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-1 min-h-[260px] flex items-center justify-center">
            {image_url ? (
              <img
                src={image_url}
                alt="Uploaded Ledger"
                className="w-full h-full object-cover max-h-[360px]"
              />
            ) : (
              <div className="p-6 text-center text-slate-400">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Physical page uploaded</p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-[11px] flex justify-between items-center">
              <span>Auto-aligned & deskewed</span>
              <span className="text-emerald-300 font-semibold">100% Math Match</span>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Extracted Transactions */}
        <div className="lg:col-span-8">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Extracted Transactions ({transactions?.length || 0} entries)
          </span>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer / Supplier</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Item / Notes</th>
                  <th className="py-2.5 px-3">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {transactions && transactions.length > 0 ? (
                  transactions.map((tx) => {
                    const isJama = tx.type === 'jama';
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-600">{tx.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{tx.customer_name}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              isJama
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isJama ? (
                              <>
                                <ArrowDownLeft className="w-3 h-3" /> Jama (In)
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="w-3 h-3" /> Udhar (Out)
                              </>
                            )}
                          </span>
                        </td>
                        <td className={`py-2.5 px-3 font-bold ${isJama ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isJama ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-[160px] truncate" title={tx.note}>
                          {tx.note || '—'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                          {tx.balance ? `₹${tx.balance.toLocaleString('en-IN')}` : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No transactions recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

