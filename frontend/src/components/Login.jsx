import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('borrower');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onLogin({
      role,
      name: name.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white text-2xl font-bold mb-4">
            V
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            VeraFi
          </h1>

          <p className="mt-2 text-slate-500">
            Building financial trust from real financial behavior.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Welcome
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose how you want to continue.
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => setRole('borrower')}
              className={`p-4 rounded-xl border text-left transition ${
                role === 'borrower'
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">👤</div>

              <p className="font-semibold text-slate-900">
                Borrower
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Build your credit profile
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('lender')}
              className={`p-4 rounded-xl border text-left transition ${
                role === 'lender'
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">🏦</div>

              <p className="font-semibold text-slate-900">
                Lender
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Review loan applications
              </p>
            </button>
          </div>

          {/* Name */}
          <form onSubmit={handleSubmit} className="mt-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Your name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full mt-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Continue as {role === 'borrower' ? 'Borrower' : 'Lender'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Hackathon prototype • AI-powered alternative credit scoring
        </p>
      </div>
    </div>
  );
}