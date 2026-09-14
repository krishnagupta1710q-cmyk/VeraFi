import React, { useState } from 'react';
import { Award, ArrowRight, TrendingUp, Calendar, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ScoreCard({ verascore, merchantName }) {
  const [loanApplied, setLoanApplied] = useState(false);

  if (!verascore) return null;

  const { score, grade, risk_level, max_eligible_loan, factors, recommendation } = verascore;

  const getScoreColor = (val) => {
    if (val >= 720) return 'text-ink bg-brand-100 border-ink';
    if (val >= 620) return 'text-ink bg-vintage-gold/50 border-ink';
    return 'text-paper bg-vintage-red border-ink';
  };

  const getProgressColor = (val) => {
    if (val >= 75) return 'bg-brand-600';
    if (val >= 50) return 'bg-vintage-gold';
    return 'bg-vintage-red';
  };

  return (
    <div className="bg-paper border-2 border-ink shadow-vintage mt-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-ink border-dashed">
        <div>
          <h2 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
            <span>3. VeraScore™ Profile</span>
            <span className="text-xs bg-vintage-gold text-ink font-bold px-2 py-0.5 border-2 border-ink uppercase tracking-wider">
              Grade {grade}
            </span>
          </h2>
          <p className="text-xs font-mono text-ink-light mt-1">
            Objective creditworthiness calculated directly from verified paper ledger velocity.
          </p>
        </div>

        <div className={`px-3 py-1 border-2 font-mono text-xs font-bold uppercase tracking-wider ${getScoreColor(score)}`}>
          {risk_level}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Score Display Card */}
        <div className="lg:col-span-4 bg-ink text-paper border-2 border-ink shadow-[4px_4px_0px_rgba(208,200,182,1)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-paper-dark uppercase tracking-wider">VeraScore</span>
              <Award className="w-5 h-5 text-vintage-gold" />
            </div>
            <div className="mt-3 flex items-baseline gap-2 font-serif">
              <span className="text-5xl font-bold tracking-tight text-paper">{score}</span>
              <span className="text-sm text-paper-dark font-medium">/ 850</span>
            </div>
            <p className="text-xs font-mono text-paper-dark mt-2 leading-relaxed">
              {recommendation}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-paper-dark/30">
            <span className="text-[11px] font-mono uppercase tracking-wider text-paper-dark block mb-1">
              Max Recommended Microloan
            </span>
            <div className="text-2xl font-serif font-bold text-brand-100">
              ₹{max_eligible_loan?.toLocaleString('en-IN')}
            </div>

            {loanApplied ? (
              <div className="mt-4 bg-brand-700 border-2 border-brand-500 text-paper font-mono text-xs font-bold py-2 px-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-100" />
                Application Sent!
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoanApplied(true)}
                className="mt-4 w-full bg-brand-500 hover:bg-brand-600 text-paper border-2 border-transparent font-mono font-bold text-xs py-2.5 px-4 flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_rgba(208,200,182,0.2)]"
              >
                <span>Request Loan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold font-mono text-ink-light uppercase tracking-wider block mb-4">
              Scoring Pillars Breakdown
            </span>

            <div className="space-y-4">
              {/* Pillar 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                    Cash Flow Volume (35%)
                  </span>
                  <span className="font-bold text-ink">{factors?.volume_score || 0}%</span>
                </div>
                <div className="w-full bg-paper-dark border border-ink h-3 shadow-[inset_1px_1px_0px_rgba(44,42,37,0.1)]">
                  <div
                    className={`h-full border-r border-ink ${getProgressColor(factors?.volume_score || 0)}`}
                    style={{ width: `${factors?.volume_score || 0}%` }}
                  />
                </div>
              </div>

              {/* Pillar 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ink-light" />
                    Business Consistency (35%)
                  </span>
                  <span className="font-bold text-ink">{factors?.consistency_score || 0}%</span>
                </div>
                <div className="w-full bg-paper-dark border border-ink h-3 shadow-[inset_1px_1px_0px_rgba(44,42,37,0.1)]">
                  <div
                    className={`h-full border-r border-ink ${getProgressColor(factors?.consistency_score || 0)}`}
                    style={{ width: `${factors?.consistency_score || 0}%` }}
                  />
                </div>
              </div>

              {/* Pillar 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-ink-light" />
                    Customer Diversity (20%)
                  </span>
                  <span className="font-bold text-ink">{factors?.diversity_score || 0}%</span>
                </div>
                <div className="w-full bg-paper-dark border border-ink h-3 shadow-[inset_1px_1px_0px_rgba(44,42,37,0.1)]">
                  <div
                    className={`h-full border-r border-ink ${getProgressColor(factors?.diversity_score || 0)}`}
                    style={{ width: `${factors?.diversity_score || 0}%` }}
                  />
                </div>
              </div>

              {/* Pillar 4 */}
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="font-bold text-ink flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-ink-light" />
                    Collection Cadence (10%)
                  </span>
                  <span className="font-bold text-ink">{factors?.cadence_score || 0}%</span>
                </div>
                <div className="w-full bg-paper-dark border border-ink h-3 shadow-[inset_1px_1px_0px_rgba(44,42,37,0.1)]">
                  <div
                    className={`h-full border-r border-ink ${getProgressColor(factors?.cadence_score || 0)}`}
                    style={{ width: `${factors?.cadence_score || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-paper-light border-2 border-ink shadow-[2px_2px_0px_rgba(44,42,37,1)] font-mono text-[11px] text-ink flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-brand-700">Zero Collateral Needed:</strong> Verified ledger reputation replaces traditional property collateral, allowing micro-loans at 1.2%–1.8%/month vs 10%/month from loan sharks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
