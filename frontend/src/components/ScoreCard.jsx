import React, { useState } from 'react';
import { Award, TrendingUp, Users, Calendar, ShieldCheck, CheckCircle2, ArrowRight, Stamp, Landmark } from 'lucide-react';

export default function ScoreCard({ verascore, merchantName }) {
  const [loanApplied, setLoanApplied] = useState(false);

  if (!verascore) return null;

  const { score, grade, risk_level, max_eligible_loan, factors, recommendation, flags } = verascore;

  // Grade color helper
  const getGradeStyle = (g) => {
    if (g === 'A') return 'border-[#15803D] text-[#15803D] bg-[#F0FDF4]';
    if (g === 'B+' || g === 'B') return 'border-amber-700 text-amber-700 bg-amber-50';
    return 'border-[#8B261E] text-[#8B261E] bg-[#FFF8F6]';
  };

  const getMeterColor = (val) => {
    if (val >= 75) return 'bg-[#15803D]';
    if (val >= 50) return 'bg-amber-600';
    return 'bg-[#8B261E]';
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#D8C7B0] shadow-xl overflow-hidden ledger-paper">
      
      {/* Certificate Header Banner */}
      <div className="bg-[#FAF4EB] border-b-2 border-[#D8C7B0] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif-vintage text-stone-900 tracking-wide">
              3. VeraScore™ Alternative Credit Profile
            </h2>
            <span className={`stamp-seal text-[10px] ${getGradeStyle(grade)}`}>
              Grade {grade}
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1 font-serif-vintage">
            Objective financial creditworthiness computed directly from physical ledger velocity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold text-stone-700 font-serif-vintage">
            Risk Tier:
          </span>
          <span className={`stamp-seal text-[10px] ${getGradeStyle(grade)}`}>
            {risk_level}
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Vintage Wax-Sealed Promissory Certificate (Col 5) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#251E19] to-[#1C1613] text-amber-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl border-4 border-[#8B261E] relative overflow-hidden">
          
          {/* Ornate Gold Inset Border */}
          <div className="absolute inset-2 border border-amber-400/30 rounded-xl pointer-events-none" />

          <div>
            {/* Top Certificate Heading */}
            <div className="flex items-center justify-between border-b border-amber-800/60 pb-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase block">
                  VeraFi Trust Deed
                </span>
                <span className="font-handwriting text-base text-amber-200">
                  {merchantName || 'Merchant Ledger Account'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-md">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* Huge Vintage Score Stamp */}
            <div className="mt-6 text-center">
              <span className="text-[11px] uppercase tracking-widest text-amber-300/80 font-bold block mb-1">
                Calculated VeraScore™
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black font-serif-vintage tracking-tight text-white drop-shadow-md">
                  {score}
                </span>
                <span className="text-lg font-bold font-serif-vintage text-amber-400">
                  / 850
                </span>
              </div>
              <div className="mt-1">
                <span className="stamp-seal text-[10px] bg-amber-900/40 text-amber-200 border-amber-400/60 tracking-wider">
                  CIBIL-Alternative Micro-Rating
                </span>
              </div>
            </div>

            {/* Recommendation prose */}
            <div className="mt-6 p-3.5 bg-black/30 rounded-xl border border-amber-900/60 text-xs text-amber-100/90 font-serif-vintage leading-relaxed">
              "{recommendation}"
            </div>
          </div>

          {/* Microloan Qualification Box */}
          <div className="mt-6 pt-5 border-t border-amber-800/60">
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block mb-1">
              Maximum Eligible Microloan
            </span>
            <div className="text-3xl font-extrabold font-ledger-mono text-emerald-400">
              ₹{(max_eligible_loan || 0).toLocaleString('en-IN')}
            </div>

            {loanApplied ? (
              <div className="mt-4 bg-[#143324] border-2 border-emerald-500/80 text-emerald-200 text-xs font-bold py-3 px-4 rounded-xl flex items-center gap-2 shadow-inner">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Microloan Request Dispatched to MFI Registry!</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoanApplied(true)}
                className="mt-4 w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all border border-emerald-400/40"
              >
                <Landmark className="w-4 h-4" />
                <span>Request Microloan from MFI Partners</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: The 4 Underwriting Pillars (Col 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 font-serif-vintage">
                Underwriting Pillar Analysis
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                Formula Weight: 100%
              </span>
            </div>

            <div className="space-y-5">
              {/* Pillar 1: Cash Flow Volume */}
              <div className="p-3.5 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <div className="flex justify-between text-xs mb-1.5 font-serif-vintage">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#15803D]" />
                    1. Cash Flow Volume (35% Weight)
                  </span>
                  <span className="font-ledger-mono font-bold text-stone-900">
                    {factors?.volume_score || 0}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getMeterColor(factors?.volume_score || 0)}`}
                    style={{ width: `${factors?.volume_score || 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Evaluates daily Jama cash inflows compared to the ₹25,000 baseline loan ticket.
                </p>
              </div>

              {/* Pillar 2: Business Consistency */}
              <div className="p-3.5 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <div className="flex justify-between text-xs mb-1.5 font-serif-vintage">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-700" />
                    2. Business Consistency (35% Weight)
                  </span>
                  <span className="font-ledger-mono font-bold text-stone-900">
                    {factors?.consistency_score || 0}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getMeterColor(factors?.consistency_score || 0)}`}
                    style={{ width: `${factors?.consistency_score || 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Rewards consistent active days in business over the ledger logging cycle.
                </p>
              </div>

              {/* Pillar 3: Customer Diversity */}
              <div className="p-3.5 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <div className="flex justify-between text-xs mb-1.5 font-serif-vintage">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-700" />
                    3. Customer Diversity (20% Weight)
                  </span>
                  <span className="font-ledger-mono font-bold text-stone-900">
                    {factors?.diversity_score || 0}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getMeterColor(factors?.diversity_score || 0)}`}
                    style={{ width: `${factors?.diversity_score || 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Protects against single-client concentration by measuring distinct paying buyers.
                </p>
              </div>

              {/* Pillar 4: Collection Cadence */}
              <div className="p-3.5 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <div className="flex justify-between text-xs mb-1.5 font-serif-vintage">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    4. Inflow Cadence & Recovery (10% Weight)
                  </span>
                  <span className="font-ledger-mono font-bold text-stone-900">
                    {factors?.cadence_score || 0}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getMeterColor(factors?.cadence_score || 0)}`}
                    style={{ width: `${factors?.cadence_score || 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Measures ratio of realized cash collections against outstanding informal credit.
                </p>
              </div>
            </div>
          </div>

          {/* Social Impact / Anti-Loan Shark Note */}
          <div className="mt-6 p-4 bg-[#F2FAF4] border-2 border-[#15803D]/30 rounded-xl text-xs text-stone-700 font-serif-vintage flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#15803D] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#15803D]">Zero Collateral Microfinance:</strong>
              <p className="mt-0.5 text-stone-600 leading-relaxed">
                By replacing property collateral with verifiable ledger velocity, VeraFi qualifies micro-entrepreneurs for institutional financing at 1.2%–1.8% monthly interest, replacing 5%–10%/month informal predatory moneylenders.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
