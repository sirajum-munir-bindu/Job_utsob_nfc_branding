import Link from "next/link";
import { Tv, CreditCard, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Light Ambient Background Blooms & Large Job Utsob Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[850px] h-[850px] sm:w-[1100px] sm:h-[1100px] opacity-[0.22] mix-blend-multiply">
          <img
            src="/assets/job-utsob-bg.png"
            alt="Job Utsob 2026 Background"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/assets/skill-jobs-logo.png"
            alt="Skill Jobs"
            className="h-7 sm:h-9 w-auto object-contain"
          />
          <div className="border-l border-slate-200 pl-2.5 sm:pl-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider sm:tracking-widest px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700">
                DIU JOB UTSOB 2026
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Live NFC Card Branding & Generation Studio
            </p>
          </div>
        </div>
      </header>

      {/* Main Selection Stage: Direct Action Choice */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center text-center my-auto w-full">
        {/* Action Choice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
          {/* PRIMARY OPTION: Live TV Display */}
          <Link
            href="/display"
            className="group relative bg-white hover:bg-sky-50/40 border-2 border-sky-300 hover:border-sky-500 rounded-3xl p-6 text-left transition-all shadow-md hover:shadow-xl flex flex-col justify-between transform hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform shadow-sm">
                  <Tv className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 bg-sky-600 text-white rounded-full font-sans">
                  Venue Display
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                Open Live TV Display
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider mt-6 group-hover:translate-x-1.5 transition-transform">
              <span>Launch TV View</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </Link>

          {/* SECONDARY OPTION: Admin Panel */}
          <Link
            href="/admin"
            className="group relative bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-400 rounded-3xl p-6 text-left transition-all shadow-md hover:shadow-xl flex flex-col justify-between transform hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
                  <CreditCard className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                  Team Operations
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                Admin Entry Console
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mt-6 group-hover:translate-x-1.5 transition-transform">
              <span>Go to Admin Panel</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-slate-200 bg-white/50 text-center text-xs text-slate-500">
        DIU Job Utsob 2026 • Skill Jobs Smart NFC System • Career Development Center (CDC)
      </footer>
    </div>
  );
}
