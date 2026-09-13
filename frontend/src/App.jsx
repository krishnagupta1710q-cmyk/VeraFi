import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import BorrowerDashboard from './components/BorrowerDashboard';
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

  const handleLogout = () => {
    setUser(null);
    setLedgerData(null);
    setUploadError(null);
  };

  const handleSwitchRole = (newRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole } : { name: 'Guest Merchant', role: newRole }));
  };

  const handleLedgerExtracted = async (file) => {
    setIsLoading(true);
    setUploadError(null);

    try {
      const data = await uploadLedgerImage(file);
      setLedgerData(data);
    } catch (err) {
      console.error('[VeraFi] Upload error:', err);
      setUploadError(err.message || 'Upload failed. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-stone-900">
      {/* Vintage Leatherette Masthead */}
      <Navbar
        activeRole={user.role}
        onSwitchRole={handleSwitchRole}
        currentUser={user}
        onLogout={handleLogout}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
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

      {/* Vintage Deckled Footer */}
      <footer className="border-t-2 border-[#D8C7B0] bg-[#FAF4EB] py-8 text-center text-xs text-stone-600 font-serif-vintage mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="font-handwriting text-xl text-[#8B261E]">
            "अतिथि देवो भव • साख ही सबसे बड़ी पूंजी है"
          </div>
          <p className="font-bold tracking-wider uppercase text-stone-700">
            VeraFi Bahi-Khata • AI-Powered Microfinance for the Credit-Invisible
          </p>
          <p className="text-[11px] text-stone-500">
            Built for the Hackathon by CSE Undergraduates • Multimodal Gemini AI OCR + Alternative VeraScore™ Engine
          </p>
        </div>
      </footer>
    </div>
  );
}