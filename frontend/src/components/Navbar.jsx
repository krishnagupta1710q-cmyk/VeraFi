import React from 'react';
import { ShieldCheck, Store, Building2, LogOut } from 'lucide-react';

export default function Navbar({ activeTab }) {
  const isBorrower = activeTab === 'merchant' || activeTab === 'borrower';

  return (
    <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink shadow-vintage">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-600 flex items-center justify-center text-paper border-2 border-ink shadow-[2px_2px_0px_rgba(44,42,37,1)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-ink">VeraFi</span>
              <span className="bg-vintage-gold text-ink text-xs font-bold px-2 py-0.5 border-2 border-ink uppercase tracking-wider">
                Prototype
              </span>
            </div>
            <p className="text-xs text-ink-light font-mono hidden sm:block tracking-tight">AI Microfinance for the Credit-Invisible</p>
          </div>
        </div>

        {/* Current Role Badge */}
        <div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 bg-paper-dark border-2 border-ink shadow-[inset_2px_2px_0px_rgba(44,42,37,0.1)]">
          {isBorrower ? (
            <>
              <Store className="w-4 h-4 text-brand-600" />
              <span className="font-mono uppercase tracking-wider text-xs font-bold text-ink">Shopkeeper View</span>
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4 text-indigo-800" />
              <span className="font-mono uppercase tracking-wider text-xs font-bold text-ink">Lender Portal</span>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
