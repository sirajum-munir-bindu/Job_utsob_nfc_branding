"use client";

import React, { useState } from "react";
import { Download, RotateCcw, X, CheckCircle2, Tv } from "lucide-react";
import { NFCCardTemplate } from "../card/NFCCardTemplate";

interface CardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  } | null;
  card: {
    fileName: string;
    downloadUrl: string;
    previewDataUrl?: string;
  } | null;
  onGenerateAnother: () => void;
}

export function CardPreviewModal({
  isOpen,
  onClose,
  student,
  card,
  onGenerateAnother,
}: CardPreviewModalProps) {
  if (!isOpen || !student) return null;

  const handleDownload = () => {
    if (!card) return;
    const a = document.createElement("a");
    a.href = card.downloadUrl;
    a.download = card.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4 sm:mb-6 mt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            NFC Card Successfully Generated
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            {student.fullName}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
            Official DIU Job Utsob 2026 • Live on venue TV display
          </p>
        </div>

        {/* Interactive 3D Card Display */}
        <div className="w-full flex justify-center my-4 sm:my-6">
          <NFCCardTemplate
            studentName={student.fullName}
            cardImageUrl={card?.downloadUrl || card?.previewDataUrl}
            size="lg"
            interactive={true}
          />
        </div>

        {/* Live Broadcast Indicator */}
        <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-xl py-2 px-3 sm:px-4 mb-4 sm:mb-6 text-center">
          <Tv className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
          <span>Currently broadcasting on the Live TV Screen</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-md text-xs sm:text-sm transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            Download High-Res PNG
          </button>

          <button
            onClick={onGenerateAnother}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl border border-slate-200 text-xs sm:text-sm transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Generate Another Card
          </button>
        </div>
      </div>
    </div>
  );
}
