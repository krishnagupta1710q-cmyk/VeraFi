import BorrowerDashboard from './components/BorrowerDashboard';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';

import LenderDashboard from './components/LenderDashboard';
import { uploadLedgerImage } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLedgerExtracted = async (file) => {
    setIsLoading(true);
    setUploadError(null);
    setLedgerData(null);

    try {
      const data = await uploadLedgerImage(file);
      setLedgerData(data);
    } catch (err) {
      console.error('[VeraFi] Upload failed:', err);
      setUploadError(err.message || 'Upload failed. Make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
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
    uploadError={uploadError}
    onLedgerExtracted={handleLedgerExtracted}
  />
) : (
          <LenderDashboard />
        )}
      </main>

      <footer className="border-t-2 border-ink bg-paper-dark py-6 text-center text-xs text-ink-light font-mono">
        <p>
          VeraFi • AI-Powered Microfinance for the Credit-Invisible • Hackathon Prototype
        </p>
      </footer>
    </div>
  );
}
