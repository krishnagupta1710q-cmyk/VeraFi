import React from 'react';
import UploadSection from './UploadSection';
import LedgerViewer from './LedgerViewer';
import ScoreCard from './ScoreCard';

export default function BorrowerDashboard({
  user,
  ledgerData,
  isLoading,
  setIsLoading,
  onLedgerExtracted,
}) {
  return (
    <div>
      {/* Welcome section */}
      <div className="mb-8">
        <p className="text-sm text-slate-500">Welcome back</p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          {user?.name}
        </h1>

        <p className="text-slate-500 mt-2">
          Upload your financial ledger to build your credit profile.
        </p>
      </div>

      {/* Upload section */}
      <UploadSection
        onLedgerExtracted={onLedgerExtracted}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />

      {/* Ledger */}
      <div className="mt-8">
        <LedgerViewer ledgerData={ledgerData} />
      </div>

      {/* Credit Score */}
      <div className="mt-8">
        <ScoreCard
          verascore={ledgerData?.verascore}
          merchantName={ledgerData?.merchant_name}
        />
      </div>
    </div>
  );
}