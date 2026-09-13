import React from 'react';
import { BookOpen, Landmark, UserCheck, LogOut, Sparkles } from 'lucide-react';

export default function Navbar({ activeRole, onSwitchRole, currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-[#241E19] text-[#F5EFE6] border-b-4 border-[#8B261E] shadow-lg">
      {/* Gold foil decorative sub-bar */}
      <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        {/* Brand Logo styled like a vintage book title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-[#8B261E] border-2 border-amber-400/60 flex items-center justify-center text-amber-200 shadow-md transform -rotate-1">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl font-serif-vintage tracking-wider font-bold text-amber-100">
                VeraFi
              </span>
              <span className="font-handwriting text-lg text-amber-300 tracking-wide">
                बही-खाता
              </span>
              <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded border border-amber-700/50">
                AI Microfinance
              </span>
            </div>
            <p className="text-[11px] text-[#C9BAA7] hidden sm:block italic font-serif-vintage">
              Physical Ledger Intelligence for the Credit-Invisible
            </p>
          </div>
        </div>

        {/* Center: Role Switcher styled like Leather Ribbon Bookmarks */}
        <div className="flex items-center bg-[#181411] p-1 rounded-xl border border-amber-900/40 shadow-inner">
          <button
            type="button"
            onClick={() => onSwitchRole('borrower')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeRole === 'borrower'
                ? 'bg-[#8B261E] text-amber-100 shadow-sm border border-amber-500/40 font-bold'
                : 'text-[#C9BAA7] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-sm">📓</span>
            <span>Borrower Khata</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchRole('lender')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeRole === 'lender'
                ? 'bg-[#1E3A2F] text-emerald-200 shadow-sm border border-emerald-500/40 font-bold'
                : 'text-[#C9BAA7] hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lender Registry</span>
          </button>
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center space-x-3">
          {currentUser && (
            <div className="hidden lg:flex items-center space-x-2 text-xs bg-[#181411] px-3 py-1.5 rounded-lg border border-amber-900/30 text-[#D8C7B5]">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{currentUser.name}</span>
            </div>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="text-[#C9BAA7] hover:text-amber-200 hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
