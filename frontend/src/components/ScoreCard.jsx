import React, { useState } from 'react';
import { Award, TrendingUp, Users, Calendar, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ScoreCard({ verascore, merchantName }) {
  const [loanApplied, setLoanApplied] = useState(false);

  if (!verascore) return null;

  const { score, grade, risk_level, max_eligible_loan, factors, recommendation } = verascore;

  // Score color helper
  const getScoreColor = (val) => {
    if (val >= 720) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 620) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (val) => {
    if (val >= 75) return 'bg-emerald-500';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>3. VeraScore™ Financial Reputation Profile</span>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
              Grade {grade}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective creditworthiness calculated directly from verified paper ledger velocity.
          </p>
        </div>

        <div className={`px-3 py-1 rounded-xl border text-xs font-bold ${getScoreColor(score)}`}>
          {risk_level}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Score Display Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">VeraScore</span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-white">{score}</span>
              <span className="text-sm text-slate-400 font-medium">/ 850</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {recommendation}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/80">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
              Max Recommended Microloan
            </span>
            <div className="text-2xl font-black text-emerald-400">
              ₹{max_eligible_loan?.toLocaleString('en-IN')}
            </div>

            {loanApplied ? (
              <div className="mt-4 bg-emerald-950/60 border border-emerald-600/50 text-emerald-300 text-xs font-semibold py-2 px-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Application Sent to MFI Partners!
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoanApplied(true)}
                className="mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Request Loan from MFI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-4">
              Scoring Pillars Breakdown
            </span>

            <div className="space-y-4">
              {/* Pillar 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Cash Flow Volume (35% weight)
                  </span>
                  <span className="font-mono font-bold text-slate-900">{factors?.volume_score || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(factors?.volume_score || 0)}`}
                    style={{ width: `${factors?.volume_score || 0}%` }}
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    Business Consistency (35% weight)
                  </span>
                  <span className="font-mono font-bold text-slate-900">{factors?.consistency_score || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(factors?.consistency_score || 0)}`}
                    style={{ width: `${factors?.consistency_score || 0}%` }}
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    Customer Diversity (20% weight)
                  </span>
                  <span className="font-mono font-bold text-slate-900">{factors?.diversity_score || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(factors?.diversity_score || 0)}`}
                    style={{ width: `${factors?.diversity_score || 0}%` }}
                  />
                </div>
              </div>

              {/* Pillar 4 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    Inflow / Collection Cadence (10% weight)
                  </span>
                  <span className="font-mono font-bold text-slate-900">{factors?.cadence_score || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(factors?.cadence_score || 0)}`}
                    style={{ width: `${factors?.cadence_score || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Zero Collateral Needed:</strong> Verified ledger reputation replaces traditional property collateral, allowing micro-loans at 1.2%–1.8%/month vs 10%/month from loan sharks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

