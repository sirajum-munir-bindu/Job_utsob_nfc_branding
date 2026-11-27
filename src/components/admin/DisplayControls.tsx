"use client";

import React from "react";
import { Tv, ExternalLink } from "lucide-react";

export function DisplayControls() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex items-center justify-center shrink-0">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
              TV Venue Broadcast — Continuous Live
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ALWAYS LIVE
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block truncate sm:whitespace-normal">
            All newly personalized NFC cards appear on the TV display instantly.
          </span>
        </div>
      </div>

      <div className="w-full sm:w-auto flex items-center justify-end">
        <a
          href="/display"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
        >
          <Tv className="w-4 h-4 text-sky-600" />
          <span>Open TV View</span>
          <ExternalLink className="w-3 h-3 text-sky-500 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
