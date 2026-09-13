import React from 'react';
import UploadSection from './UploadSection';
import LedgerViewer from './LedgerViewer';
import ScoreCard from './ScoreCard';
import { BookOpen, Sparkles, HelpCircle } from 'lucide-react';

export default function BorrowerDashboard({
  user,
  ledgerData,
  isLoading,
  setIsLoading,
  uploadError,
  onLedgerExtracted,
}) {
  return (
    <div className="space-y-8">
      {/* Notebook Front Page Title Slip */}
      <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border-2 border-[#D8C7B0] shadow-md ledger-paper relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-handwriting text-2xl text-[#8B261E]">
                श्री गणेशाय नमः • Bahi-Khata Passbook
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold font-serif-vintage text-stone-900 mt-1 tracking-tight">
              {user?.name || 'Local Merchant Ledger'}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-serif-vintage">
              Photograph your physical notebook pages to establish verifiable cashflow reputation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#FAF4EB] border border-[#D8C7B0] px-3.5 py-2 rounded-xl text-right">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block">
                Khata Status
              </span>
              <span className="text-xs font-bold font-serif-vintage text-[#15803D] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                Active Register
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Upload Section */}
      <UploadSection
        onLedgerExtracted={onLedgerExtracted}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        uploadError={uploadError}
      />

      {/* 2. Ledger Viewer Table (Appears upon upload) */}
      {ledgerData && (
        <div className="transition-all duration-700 animate-fadeIn">
          <LedgerViewer ledgerData={ledgerData} />
        </div>
      )}

      {/* 3. Credit Score Certificate (Appears upon upload) */}
      {ledgerData?.verascore && (
        <div className="transition-all duration-700 animate-fadeIn">
          <ScoreCard
            verascore={ledgerData.verascore}
            merchantName={ledgerData.merchant_name || user?.name}
          />
        </div>
      )}

      {/* How it works guidance box */}
      {!ledgerData && (
        <div className="bg-[#FAF4EB] rounded-2xl p-6 border-2 border-dashed border-[#D8C7B0] text-stone-700">
          <h3 className="text-sm font-bold font-serif-vintage uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8B261E]" />
            How VeraFi Reads Your Paper Bahi-Khata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-serif-vintage leading-relaxed">
            <div className="p-3.5 bg-white/70 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block mb-1">1. Take a Photo</strong>
              Photograph today's page or yesterday's summary from your physical diary, receipt book, or register.
            </div>
            <div className="p-3.5 bg-white/70 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block mb-1">2. Multimodal AI Audit</strong>
              Gemini Vision parses handwritten Hindi/English entries, checks running balances, and verifies arithmetic.
            </div>
            <div className="p-3.5 bg-white/70 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block mb-1">3. Instant Microloan Pre-approval</strong>
              Get an objective VeraScore™ (300–850) that unlocks 1.2%/month microfinance from verified MFI partners.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}