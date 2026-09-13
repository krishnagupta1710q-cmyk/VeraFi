import React, { useState } from 'react';
import { BookOpen, Landmark, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('borrower');
  const [name, setName] = useState('');

  const handleQuickSelect = (personaName, personaRole) => {
    setName(personaName);
    setRole(personaRole);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onLogin({
      role,
      name: name.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-[#F3EFE6] flex items-center justify-center px-4 py-12">
      {/* Vintage Notebook Binder Container */}
      <div className="w-full max-w-lg">
        
        {/* Book Cover Header */}
        <div className="bg-[#7A1E1E] text-amber-100 rounded-t-3xl p-8 border-4 border-b-0 border-[#5C1616] shadow-2xl relative overflow-hidden">
          {/* Decorative Gold Inset Border */}
          <div className="absolute inset-2 border-2 border-amber-400/40 rounded-2xl pointer-events-none" />
          
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#5C1616] border-2 border-amber-300/60 text-amber-200 mb-3 shadow-md">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="font-handwriting text-2xl text-amber-300 -mb-1">
              शुभ लाभ • Shree Ganeshay Namah
            </div>

            <h1 className="text-4xl font-bold font-serif-vintage tracking-wider text-white">
              VeraFi Bahi-Khata
            </h1>

            <p className="mt-2 text-xs uppercase tracking-widest text-amber-200 font-semibold">
              The AI Credit Passbook for Local Merchants
            </p>
          </div>
        </div>

        {/* Notebook Inside Page (Cream Parchment) */}
        <div className="bg-[#FFFDF9] rounded-b-3xl border-4 border-t-0 border-[#D8C7B0] p-8 shadow-2xl ledger-paper relative">
          
          <div className="mb-6 pb-4 border-b border-stone-200">
            <h2 className="text-xl font-bold font-serif-vintage text-stone-900">
              Open Your Ledger
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Select your identity to access digital extraction and microloan underwriting.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                1. Select Portal Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('borrower')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all relative ${
                    role === 'borrower'
                      ? 'border-[#8B261E] bg-[#FFF8F6] shadow-sm ring-1 ring-[#8B261E]/30'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">🏪</span>
                    {role === 'borrower' && (
                      <span className="stamp-seal stamp-verified text-[9px] py-0 px-1.5">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-stone-900 text-sm font-serif-vintage">
                    Shopkeeper / Borrower
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Scan ledger & get VeraScore
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('lender')}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all relative ${
                    role === 'lender'
                      ? 'border-[#1E3A2F] bg-[#F4F9F6] shadow-sm ring-1 ring-[#1E3A2F]/30'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">🏦</span>
                    {role === 'lender' && (
                      <span className="stamp-seal stamp-approved text-[9px] py-0 px-1.5">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-stone-900 text-sm font-serif-vintage">
                    Microfinance Lender
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Underwrite & disburse loans
                  </p>
                </button>
              </div>
            </div>

            {/* Merchant / Officer Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                2. Your Name or Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'borrower' ? 'e.g. Ramesh Kumar (Sharma Ji Kirana)' : 'e.g. Priyanshu (Pratham Microfinance)'}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-300 focus:border-[#8B261E] focus:outline-none bg-white text-stone-900 font-medium text-sm transition-colors shadow-inner"
              />
            </div>

            {/* Quick Demo Personas */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                Quick Demo Personas:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickSelect('Sharma Ji (Kirana Store)', 'borrower')}
                  className="text-xs bg-[#FAF6EE] hover:bg-[#F2EADB] text-stone-700 font-medium px-2.5 py-1.5 rounded-lg border border-stone-300 transition-colors flex items-center gap-1.5"
                >
                  <span>🛒</span>
                  <span>Sharma Ji (Kirana)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('Raju Chaurasia (Chai Corner)', 'borrower')}
                  className="text-xs bg-[#FAF6EE] hover:bg-[#F2EADB] text-stone-700 font-medium px-2.5 py-1.5 rounded-lg border border-stone-300 transition-colors flex items-center gap-1.5"
                >
                  <span>☕</span>
                  <span>Raju (Chai Stall)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('Aditi Sen (MFI Underwriter)', 'lender')}
                  className="text-xs bg-[#FAF6EE] hover:bg-[#F2EADB] text-stone-700 font-medium px-2.5 py-1.5 rounded-lg border border-stone-300 transition-colors flex items-center gap-1.5"
                >
                  <span>🏦</span>
                  <span>Aditi (MFI Officer)</span>
                </button>
              </div>
            </div>

            {/* Submit button styled like a vintage seal */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#8B261E] hover:bg-[#721E18] text-amber-100 font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all border border-amber-400/40"
            >
              <span>Enter VeraFi Registry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-stone-200 text-center">
            <p className="text-[11px] text-stone-500 font-handwriting text-base">
              "खाता सही, तो साख सही — Clean Ledger, Fair Credit."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}