import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

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
    setIsLoading(true);
    onLedgerExtracted(file);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Upload Handwritten Ledger</span>
          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
            Gemini Vision AI
          </span>
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Take a photo of your physical khatabook, bahi-khata, or paper receipt. Gemini AI will read and extract all transactions automatically.
        </p>
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
          isLoading
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
            : dragActive
            ? 'border-emerald-500 bg-emerald-50/50 cursor-pointer'
            : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80 cursor-pointer'
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

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          {isLoading ? (
            <div>
              <p className="text-base font-semibold text-slate-800">
                Gemini AI is reading your ledger...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Extracting transactions, dates, amounts, and calculating VeraScore.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-slate-800">
                {selectedFileName && !uploadError ? (
                  <span className="flex items-center justify-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    {selectedFileName}
                  </span>
                ) : (
                  <>Click to upload or drag & drop your ledger photo</>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                JPG, PNG, WebP — photo of handwritten paper ledger or receipt
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Upload failed</p>
            <p className="text-xs text-red-600 mt-0.5">{uploadError}</p>
            <p className="text-xs text-slate-500 mt-2">
              Make sure the backend is running: <code className="bg-slate-100 px-1 rounded">cd backend && python main.py</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
