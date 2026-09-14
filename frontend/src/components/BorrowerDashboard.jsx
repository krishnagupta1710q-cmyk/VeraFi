import React from 'react';
import UploadSection from './UploadSection';
import LedgerViewer from './LedgerViewer';
import ScoreCard from './ScoreCard';

export default function BorrowerDashboard({
  user,
  ledgerData,
  isLoading,
  setIsLoading,
  uploadError,
  onLedgerExtracted,
}) {
  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <p className="text-sm font-mono text-ink-light uppercase tracking-widest">Welcome back</p>
        <h1 className="text-4xl font-serif font-bold text-ink mt-2">{user?.name}</h1>
        <p className="font-mono text-ink-light mt-2 border-l-4 border-brand-500 pl-4 py-1">
          Upload a photo of your financial ledger to build your credit profile.
        </p>
      </div>

      {/* Upload section */}
      <UploadSection
        onLedgerExtracted={onLedgerExtracted}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        uploadError={uploadError}
      />

      {/* Ledger table — only shown after upload */}
      {ledgerData && (
        <div className="mt-8">
          <LedgerViewer ledgerData={ledgerData} />
        </div>
      )}

      {/* Credit Score — only shown after upload */}
      {ledgerData?.verascore && (
        <div className="mt-8">
          <ScoreCard
            verascore={ledgerData.verascore}
            merchantName={ledgerData.merchant_name}
          />
        </div>
      )}
    </div>
  );
}
