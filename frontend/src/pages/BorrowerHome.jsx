import React from 'react';
import { Link } from 'react-router-dom';

function getScoreData(ledgerData) {
  const rawScore = ledgerData?.verascore;

  if (rawScore && typeof rawScore === 'object') {
    return rawScore;
  }

  return {
    score: rawScore ?? ledgerData?.credit_score ?? 0,
    grade: ledgerData?.grade ?? '—',
    risk_level: ledgerData?.risk_level ?? '—',
    max_eligible_loan:
      ledgerData?.max_eligible_loan ??
      ledgerData?.max_loan_amount ??
      0,
    factors:
      ledgerData?.factors ??
      ledgerData?.score_factors ??
      {},
  };
}

export default function BorrowerHome({
  user,
  ledgerData,
}) {
  const scoreData = getScoreData(ledgerData);

  const score = Number(scoreData.score) || 0;

  const maxLoan =
    Number(scoreData.max_eligible_loan) || 0;

  const grade = scoreData.grade || '—';

  const risk = scoreData.risk_level || '—';

  const summary = ledgerData?.summary || {};

  const transactions =
    ledgerData?.transactions || [];

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  return (
    <div className="space-y-8">

      {/* ================= WELCOME ================= */}
      <section>

        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          {user?.name || 'Borrower'}
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Your financial trust profile is ready to review.
        </p>

      </section>


      {/* ================= TOP CARDS ================= */}
      <section className="grid lg:grid-cols-3 gap-5">

        {/* Credit Score */}
        <Link
          to="/borrower/credit-score"
          className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Credit Score
              </p>

              <div className="mt-4 flex items-end gap-3">

                <p className="text-5xl font-bold text-slate-900 dark:text-white">
                  {score}
                </p>

                <p className="pb-2 text-sm text-slate-400">
                  / 850
                </p>

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                  Grade {grade}
                </span>

                <span className="px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  {risk}
                </span>

              </div>
            </div>


            {/* Mini score circle */}
            <div className="w-28 h-28 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center">

              <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">

                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {score}
                </span>

              </div>

            </div>

          </div>

          <p className="mt-6 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            View detailed score →
          </p>

        </Link>


        {/* Loan Eligibility */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white p-6 sm:p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

          <p className="text-sm font-medium text-indigo-100">
            Estimated loan eligibility
          </p>

          <p className="mt-5 text-3xl font-bold">
            {formatCurrency(maxLoan)}
          </p>

          <p className="mt-3 text-sm leading-6 text-indigo-100">
            Estimated from your current financial activity and credit profile.
          </p>

          <Link
            to="/borrower/upload"
            className="inline-flex mt-6 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            Update Ledger
          </Link>

        </div>

      </section>


      {/* ================= ACTIONS ================= */}
      <section>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Continue
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your financial profile.
        </p>

        <div className="mt-5 grid sm:grid-cols-3 gap-4">

          <Link
            to="/borrower/upload"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg">
              ↑
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              Upload Ledger
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add a new financial ledger.
            </p>
          </Link>


          <Link
            to="/borrower/verification"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg">
              ✦
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              AI Verification
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Review extracted financial data.
            </p>
          </Link>


          <Link
            to="/borrower/ledger"
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg">
              ▤
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              View Ledger
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Review your transactions.
            </p>
          </Link>

        </div>

      </section>


      {/* ================= FINANCIAL ACTIVITY ================= */}
      <section>

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Financial Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Summary from your latest ledger.
            </p>
          </div>

          <Link
            to="/borrower/ledger"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all
          </Link>

        </div>


        <div className="mt-5 grid sm:grid-cols-3 gap-4">

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

            <p className="text-sm text-slate-400">
              Money Received
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(summary.total_inflow)}
            </p>

          </div>


          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

            <p className="text-sm text-slate-400">
              Money Sent
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(summary.total_outflow)}
            </p>

          </div>


          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

            <p className="text-sm text-slate-400">
              Net Flow
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(summary.net_flow)}
            </p>

          </div>

        </div>

      </section>


      {/* ================= RECENT TRANSACTIONS ================= */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200 hover:shadow-lg">

        <div className="p-6 border-b border-slate-100 dark:border-slate-800">

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest activity from your ledger.
          </p>

        </div>


        <div className="divide-y divide-slate-100 dark:divide-slate-800">

          {transactions.slice(0, 5).map((transaction, index) => {

            const type =
              transaction.type ||
              transaction.transaction_type ||
              '';

            const isMoneyReceived =
              type.toLowerCase() === 'jama' ||
              type.toLowerCase() === 'credit' ||
              type.toLowerCase() === 'inflow';

            const amount =
              Number(transaction.amount) || 0;

            return (
              <div
                key={transaction.id || index}
                className="px-6 py-4 flex items-center justify-between transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isMoneyReceived
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isMoneyReceived ? '+' : '−'}
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {transaction.description ||
                        transaction.party ||
                        'Transaction'}
                    </p>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {transaction.date || 'Recent'}
                    </p>

                  </div>

                </div>


                <p
                  className={`text-sm font-bold ${
                    isMoneyReceived
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isMoneyReceived ? '+' : '−'}
                  {formatCurrency(amount)}
                </p>

              </div>
            );
          })}

          {transactions.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400">
              No transactions available yet.
            </div>
          )}

        </div>

      </section>

    </div>
  );
}