import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export default function UploadSection({ onLedgerExtracted, isLoading, setIsLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setSelectedFileName(file.name);
    setIsLoading(true);
    onLedgerExtracted(file, null);
  };

  const handleQuickSample = (sampleKey, label) => {
    setSelectedFileName(label);
    setIsLoading(true);
    onLedgerExtracted(null, sampleKey);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>1. Upload Handwritten Paper Ledger</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Gemini Vision
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Take a picture of your physical *khatabook*, *bahi-khata*, or paper receipt to generate your financial score.
          </p>
        </div>

        {/* Quick Sample Buttons for Demo */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Quick Demo:</span>
          <button
            type="button"
            onClick={() => handleQuickSample('kirana_store', 'Sample Kirana Bahi-Khata')}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Kirana Store Sample
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample('tea_stall', 'Sample Tea Stall Register')}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Chai Stall Sample
          </button>
        </div>
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50'
            : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            {isLoading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          {isLoading ? (
            <div>
              <p className="text-base font-semibold text-slate-800">
                AI Vision parsing handwriting...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Extracting dates, customer names, debit/credit entries, and verifying balances.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-slate-800">
                {selectedFileName ? (
                  <span className="flex items-center justify-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Selected: {selectedFileName}
                  </span>
                ) : (
                  <>Click to upload or drag & drop ledger photo</>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports JPG, PNG, WebP (English, Hindi, regional scripts supported)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

