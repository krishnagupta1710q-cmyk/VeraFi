import BorrowerDashboard from './components/BorrowerDashboard';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';

import LenderDashboard from './components/LenderDashboard';
import { SAMPLE_DATASETS } from './mockData';
import { uploadLedgerImage } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLedgerExtracted = async (file, sampleKey) => {
    setIsLoading(true);
    console.log('[VeraFi] Upload started:', { file: file?.name, sampleKey });

    try {
      const data = await uploadLedgerImage(file, sampleKey);
      console.log('[VeraFi] Data received:', data);
      setLedgerData(data);
    } catch (err) {
      console.error('[VeraFi] Failed to extract ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        activeTab={user.role}
        setActiveTab={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {user.role === 'borrower' ? (
  <BorrowerDashboard
    user={user}
    ledgerData={ledgerData}
    isLoading={isLoading}
    setIsLoading={setIsLoading}
    onLedgerExtracted={handleLedgerExtracted}
  />
) : (
          <LenderDashboard />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>
          VeraFi • AI-Powered Microfinance for the Credit-Invisible • Hackathon Prototype
        </p>
      </footer>
    </div>
  );
}