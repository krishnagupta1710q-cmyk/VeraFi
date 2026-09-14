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
    <div className="bg-paper p-6 border-2 border-ink shadow-vintage">
      <div className="mb-6">
        <h2 className="text-xl font-serif font-bold text-ink flex items-center gap-2">
          <span>Upload Handwritten Ledger</span>
          <span className="text-xs bg-vintage-gold text-ink font-bold px-2 py-0.5 border-2 border-ink uppercase tracking-wider">
            Gemini Vision AI
          </span>
        </h2>
        <p className="text-sm font-mono text-ink-light mt-1">
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
        className={`border-2 border-dashed border-ink p-10 text-center transition-all ${
          isLoading
            ? 'bg-paper-dark cursor-not-allowed'
            : dragActive
            ? 'bg-brand-100 cursor-pointer'
            : 'bg-paper-light hover:bg-brand-50 cursor-pointer'
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
          <div className="w-16 h-16 bg-paper flex items-center justify-center border-2 border-ink shadow-vintage-hover mb-4">
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin text-ink" />
            ) : (
              <UploadCloud className="w-8 h-8 text-ink" />
            )}
          </div>

          {isLoading ? (
            <div>
              <p className="text-base font-serif font-bold text-ink">
                Gemini AI is reading your ledger...
              </p>
              <p className="text-xs font-mono text-ink-light mt-1">
                Extracting transactions, dates, amounts, and calculating VeraScore.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-base font-serif font-bold text-ink">
                {selectedFileName && !uploadError ? (
                  <span className="flex items-center justify-center gap-1.5 text-brand-700">
                    <CheckCircle2 className="w-4 h-4" />
                    {selectedFileName}
                  </span>
                ) : (
                  <>Click to upload or drag & drop your ledger photo</>
                )}
              </p>
              <p className="text-xs font-mono text-ink-light mt-1">
                JPG, PNG, WebP — photo of handwritten paper ledger or receipt
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {uploadError && (
        <div className="mt-4 p-4 bg-vintage-red/10 border-2 border-vintage-red flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-vintage-red flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-vintage-red font-serif">Upload failed</p>
            <p className="text-xs text-ink mt-0.5 font-mono">{uploadError}</p>
            <p className="text-xs text-ink-light mt-2 font-mono">
              Make sure the backend is running: <code className="bg-paper-dark px-1 border border-ink">cd backend && python main.py</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
