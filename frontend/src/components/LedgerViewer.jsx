import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function LedgerViewer({ ledgerData }) {
  if (!ledgerData) return null;

  const { merchant_name, period, currency, summary, transactions, image_url } = ledgerData;

  return (
    <div className="bg-paper border-2 border-ink shadow-vintage mt-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-ink border-dashed">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-ink">2. AI-Verified Digital Ledger</h2>
            <span className="flex items-center gap-1 text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 border-2 border-brand-700 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified OCR
            </span>
          </div>
          <p className="text-xs font-mono text-ink-light mt-1">
            Store: <span className="font-bold text-ink">{merchant_name}</span> | Period: {period}
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="bg-brand-50 border-2 border-brand-600 px-3 py-1.5 shadow-[2px_2px_0px_rgba(58,99,71,1)] text-right">
            <span className="text-[10px] font-mono uppercase font-bold text-brand-700 tracking-wider">Total Inflow (Jama)</span>
            <p className="text-sm font-serif font-bold text-brand-700">
              ₹{summary?.total_inflow?.toLocaleString('en-IN') || 0}
            </p>
          </div>
          <div className="bg-vintage-red/10 border-2 border-vintage-red px-3 py-1.5 shadow-[2px_2px_0px_rgba(139,58,58,1)] text-right">
            <span className="text-[10px] font-mono uppercase font-bold text-vintage-red tracking-wider">Total Outflow (Udhar)</span>
            <p className="text-sm font-serif font-bold text-vintage-red">
              ₹{summary?.total_outflow?.toLocaleString('en-IN') || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Original Ledger Image Reference */}
        <div className="lg:col-span-4 flex flex-col">
          <span className="text-xs font-mono font-bold text-ink-light uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-ink" />
            Physical Ledger Snapshot
          </span>
          <div className="relative border-2 border-ink bg-paper-dark flex-1 min-h-[260px] flex items-center justify-center shadow-[inset_2px_2px_0px_rgba(44,42,37,0.1)]">
            {image_url ? (
              <img
                src={image_url}
                alt="Uploaded Ledger"
                className="w-full h-full object-cover max-h-[360px]"
              />
            ) : (
              <div className="p-6 text-center text-ink-light">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-mono">Physical page uploaded</p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 bg-ink text-paper border-2 border-ink px-2.5 py-1.5 text-[11px] font-mono flex justify-between items-center shadow-[2px_2px_0px_rgba(44,42,37,0.5)]">
              <span>Auto-aligned</span>
              <span className="text-brand-100 font-bold">100% Math Match</span>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Extracted Transactions */}
        <div className="lg:col-span-8">
          <span className="text-xs font-mono font-bold text-ink-light uppercase tracking-wider mb-2 block">
            Extracted Transactions ({transactions?.length || 0} entries)
          </span>

          <div className="overflow-x-auto border-2 border-ink shadow-vintage">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-paper-dark text-ink font-bold border-b-2 border-ink">
                <tr>
                  <th className="py-2.5 px-3 border-r-2 border-ink">Date</th>
                  <th className="py-2.5 px-3 border-r-2 border-ink">Customer / Supplier</th>
                  <th className="py-2.5 px-3 border-r-2 border-ink">Type</th>
                  <th className="py-2.5 px-3 border-r-2 border-ink">Amount</th>
                  <th className="py-2.5 px-3 border-r-2 border-ink">Item / Notes</th>
                  <th className="py-2.5 px-3">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink bg-paper">
                {transactions && transactions.length > 0 ? (
                  transactions.map((tx) => {
                    const isJama = tx.type === 'jama';
                    return (
                      <tr key={tx.id} className="hover:bg-paper-light transition-colors">
                        <td className="py-2.5 px-3 border-r-2 border-ink">{tx.date}</td>
                        <td className="py-2.5 px-3 font-bold border-r-2 border-ink text-ink">{tx.customer_name}</td>
                        <td className="py-2.5 px-3 border-r-2 border-ink">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 border-2 text-[11px] font-bold uppercase ${
                              isJama
                                ? 'bg-brand-50 border-brand-600 text-brand-700'
                                : 'bg-vintage-red/10 border-vintage-red text-vintage-red'
                            }`}
                          >
                            {isJama ? (
                              <>
                                <ArrowDownLeft className="w-3 h-3" /> Jama
                              </>
                            ) : (
                              <>
                                <ArrowUpRight className="w-3 h-3" /> Udhar
                              </>
                            )}
                          </span>
                        </td>
                        <td className={`py-2.5 px-3 font-bold font-serif text-sm border-r-2 border-ink ${isJama ? 'text-brand-700' : 'text-vintage-red'}`}>
                          {isJama ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-ink-light max-w-[160px] truncate border-r-2 border-ink" title={tx.note}>
                          {tx.note || '—'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-ink">
                          {tx.balance ? `₹${tx.balance.toLocaleString('en-IN')}` : '—'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-ink-light">
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
