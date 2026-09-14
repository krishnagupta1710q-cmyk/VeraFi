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
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 border-2 border-ink shadow-[2px_2px_0px_rgba(44,42,37,1)] text-paper font-serif text-2xl font-bold mb-4">
            V
          </div>

          <h1 className="text-4xl font-serif font-bold text-ink">
            VeraFi
          </h1>

          <p className="mt-2 font-mono text-ink-light">
            Building financial trust from real financial behavior.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-paper-light border-2 border-ink shadow-[4px_4px_0px_rgba(44,42,37,1)] p-6">
          <h2 className="text-xl font-serif font-bold text-ink">
            Welcome
          </h2>

          <p className="mt-1 font-mono text-sm text-ink-light">
            Choose how you want to continue.
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() => setRole('borrower')}
              className={`p-4 border-2 text-left transition ${
                role === 'borrower'
                  ? 'border-ink bg-brand-100 shadow-[2px_2px_0px_rgba(44,42,37,1)]'
                  : 'border-ink/20 hover:border-ink hover:bg-paper'
              }`}
            >
              <div className="text-2xl mb-2">👤</div>

              <p className="font-bold font-serif text-ink">
                Borrower
              </p>

              <p className="text-xs font-mono text-ink-light mt-1">
                Build your credit profile
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('lender')}
              className={`p-4 border-2 text-left transition ${
                role === 'lender'
                  ? 'border-ink bg-brand-100 shadow-[2px_2px_0px_rgba(44,42,37,1)]'
                  : 'border-ink/20 hover:border-ink hover:bg-paper'
              }`}
            >
              <div className="text-2xl mb-2">🏦</div>

              <p className="font-bold font-serif text-ink">
                Lender
              </p>

              <p className="text-xs font-mono text-ink-light mt-1">
                Review loan applications
              </p>
            </button>
          </div>

          {/* Name */}
          <form onSubmit={handleSubmit} className="mt-6">
            <label
              htmlFor="name"
              className="block font-mono text-sm font-bold text-ink mb-2 uppercase tracking-wider"
            >
              Your name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-paper border-2 border-ink outline-none focus:bg-brand-50 shadow-[inset_2px_2px_0px_rgba(44,42,37,0.1)] font-mono text-ink"
            />

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full mt-4 py-3 bg-brand-600 text-paper font-bold font-mono uppercase tracking-wider hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition border-2 border-transparent disabled:border-transparent hover:shadow-[2px_2px_0px_rgba(44,42,37,0.5)]"
            >
              Continue as {role === 'borrower' ? 'Borrower' : 'Lender'}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-xs text-ink-light mt-6">
          Hackathon prototype • AI-powered alternative credit scoring
        </p>
      </div>
    </div>
  );
}
