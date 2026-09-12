import React, { useState } from 'react';
import Navbar from './components/Navbar';
import UploadSection from './components/UploadSection';
import LedgerViewer from './components/LedgerViewer';
import ScoreCard from './components/ScoreCard';
import LenderDashboard from './components/LenderDashboard';
import { SAMPLE_DATASETS } from './mockData';
import { uploadLedgerImage } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('merchant'); // 'merchant' | 'lender'
  const [ledgerData, setLedgerData] = useState(SAMPLE_DATASETS.kirana_store);
  const [isLoading, setIsLoading] = useState(false);

  const handleLedgerExtracted = async (file, sampleKey) => {
    setIsLoading(true);
    try {
      const data = await uploadLedgerImage(file, sampleKey);
      setLedgerData(data);
    } catch (err) {
      console.error('Failed to extract ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'merchant' ? (
          <div>
            {/* Step 1: Upload */}
            <UploadSection
              onLedgerExtracted={handleLedgerExtracted}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* Step 2: OCR Extracted Table */}
            <LedgerViewer ledgerData={ledgerData} />

            {/* Step 3: VeraScore Card */}
            <ScoreCard
              verascore={ledgerData?.verascore}
              merchantName={ledgerData?.merchant_name}
            />
          </div>
        ) : (
          /* Institutional Lender Dashboard */
          <LenderDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>VeraFi • AI-Powered Microfinance for the Credit-Invisible • Hackathon Prototype</p>
      </footer>
    </div>
  );
}

