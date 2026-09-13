import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, CheckCircle2, Loader2, AlertCircle, Sparkles, FileImage } from 'lucide-react';

export default function UploadSection({ onLedgerExtracted, isLoading, setIsLoading, uploadError }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
    if (setIsLoading) setIsLoading(true);
    onLedgerExtracted(file);
  };

  return (
    <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 border-2 border-[#D8C7B0] shadow-md ledger-paper relative">
      
      {/* Header section with vintage stamps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-dashed border-[#E3D4BF]">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold font-serif-vintage text-stone-900">
              1. Scan Physical Notebook Page
            </h2>
            <span className="stamp-seal stamp-verified text-[10px]">
              AI OCR Ready
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Snap a clear photo of your paper *khatabook*, diary register, or cash memo receipt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-stone-500 bg-[#FAF6EE] px-2.5 py-1 rounded border border-stone-300">
            Supports Hindi & English Handwriting
          </span>
        </div>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`border-3 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer relative overflow-hidden ${
          isLoading
            ? 'border-stone-300 bg-amber-50/30 cursor-not-allowed'
            : dragActive
            ? 'border-[#8B261E] bg-[#FFF8F6] scale-[1.01]'
            : 'border-[#C8B69F] hover:border-[#8B261E] hover:bg-[#FDFBF7]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="max-w-md mx-auto flex flex-col items-center relative z-10">
          {/* Central Circular Seal Icon */}
          <div className="w-18 h-18 rounded-2xl bg-[#FAF6EE] border-2 border-[#D8C7B0] text-[#8B261E] flex items-center justify-center mb-4 shadow-sm">
            {isLoading ? (
              <Loader2 className="w-9 h-9 animate-spin text-[#8B261E]" />
            ) : (
              <Camera className="w-9 h-9" />
            )}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-stone-900 font-bold font-serif-vintage text-lg">
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Gemini Vision Parsing Handwriting...</span>
              </div>
              <p className="text-xs text-stone-600">
                Auditing debit/credit entries, calculating daily velocity, and computing your VeraScore™.
              </p>
              <div className="w-48 mx-auto bg-stone-200 h-1.5 rounded-full overflow-hidden mt-3">
                <div className="bg-[#8B261E] h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold font-serif-vintage text-stone-900">
                {selectedFileName && !uploadError ? (
                  <span className="flex items-center justify-center gap-2 text-[#15803D]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Loaded: {selectedFileName}</span>
                  </span>
                ) : (
                  <>Click to Snap or Drop Ledger Photo</>
                )}
              </p>
              <p className="text-xs text-stone-500 mt-1.5">
                Accepts JPG, PNG, WebP (from phone camera or local gallery)
              </p>

              {/* Action pill button */}
              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B261E] hover:bg-[#721E18] text-amber-100 text-xs font-bold uppercase tracking-wider shadow-sm transition-all">
                <UploadCloud className="w-4 h-4" />
                <span>Choose Image from Device</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error alert notice */}
      {uploadError && (
        <div className="mt-5 p-4 bg-[#FEF2F2] border-2 border-red-300 rounded-xl flex items-start gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-xs font-bold text-red-900 uppercase tracking-wider">
              OCR Processing Notice
            </p>
            <p className="text-xs text-red-800 mt-1 font-mono break-all">
              {uploadError}
            </p>
            <p className="text-[11px] text-stone-600 mt-2">
              Tip: Verify your Gemini key in <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">backend/.env</code> or check <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">http://localhost:8000/api/test-gemini</code>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
