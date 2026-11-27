"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NFCCardTemplate } from "../card/NFCCardTemplate";
import { Wifi, Sparkles, Maximize2 } from "lucide-react";

interface DisplayState {
  mode: "WELCOME" | "CARD" | "CELEBRATION";
  studentName: string | null;
  cardImageUrl: string | null;
  isPaused: boolean;
  updatedAt: string;
}

export function LiveDisplay() {
  const [displayState, setDisplayState] = useState<DisplayState>({
    mode: "CARD",
    studentName: null,
    cardImageUrl: null,
    isPaused: false,
    updatedAt: new Date().toISOString(),
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const lastUpdatedRef = useRef<string>("");

  // Connect to SSE for instant push, plus 2s polling fallback for 100% reliability
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const setupSSE = () => {
      try {
        eventSource = new EventSource("/api/display/events");

        eventSource.addEventListener("display_update", (e) => {
          try {
            const data: DisplayState = JSON.parse(e.data);
            if (data.updatedAt !== lastUpdatedRef.current) {
              lastUpdatedRef.current = data.updatedAt;
              setDisplayState(data);
              setCelebrationKey((prev) => prev + 1);
            }
          } catch {}
        });

        eventSource.onerror = () => {
          eventSource?.close();
        };
      } catch {}
    };

    setupSSE();

    // Resilient Polling Fallback
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/display/current", { cache: "no-store" });
        if (res.ok) {
          const data: DisplayState = await res.json();
          if (data.updatedAt !== lastUpdatedRef.current) {
            lastUpdatedRef.current = data.updatedAt;
            setDisplayState(data);
            setCelebrationKey((prev) => prev + 1);
          }
        }
      } catch {}
    }, 2000);

    return () => {
      eventSource?.close();
      clearInterval(pollInterval);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isCardActive = Boolean(displayState.studentName);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 flex flex-col justify-between select-none">
      {/* Background Soft Festival Color Accents & Official Job Utsob Motif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Official Job Utsob 2026 Background Theme Motif - Big & Vivid */}
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[950px] h-[950px] md:w-[1250px] md:h-[1250px] xl:w-[1450px] xl:h-[1450px] opacity-[0.48] mix-blend-multiply pointer-events-none"
        >
          <img
            src="/assets/job-utsob-bg.png"
            alt="Job Utsob 2026 Background Theme"
            className="w-full h-full object-contain"
          />
        </motion.div>

        {/* Soft Job Utsob Green Orb */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[140px]"
        />

        {/* Skill Jobs Cyan Orb */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-[650px] h-[650px] bg-sky-200/45 rounded-full blur-[160px]"
        />

        {/* Festive Golden Amber Accent */}
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.15],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-200/30 rounded-full blur-[180px]"
        />
      </div>

      {/* TOP HEADER: Event Branding & Official Logos */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between border-b border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm">
        {/* Left: Skill Jobs Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img
            src="/assets/skill-jobs-logo.png"
            alt="Skill Jobs"
            className="h-8 sm:h-11 w-auto object-contain"
          />
          <div className="border-l border-slate-200 pl-2.5 sm:pl-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-bold">
                NFC CARD
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 tracking-wider font-semibold uppercase mt-0.5">
              Live Digital Personalization
            </p>
          </div>
        </div>

        {/* Center: DIU Job Utsob Title */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-2 text-sm font-bold tracking-[4px] text-slate-800 uppercase">
            <span>DAFFODIL INTERNATIONAL UNIVERSITY</span>
          </div>
          <div className="text-xs text-emerald-700 font-bold tracking-widest mt-0.5">
            CAREER DEVELOPMENT CENTER (CDC)
          </div>
        </div>

        {/* Right: Official Job Utsob 2026 Logo Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-2xl px-2.5 sm:px-3.5 py-1.5 shadow-md border border-slate-200">
            <img
              src="/assets/job-utsob-logo.png"
              alt="Job Utsob 2026 Logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
            <div className="border-l border-slate-200 pl-2 sm:pl-2.5 text-left">
              <div className="text-[9px] sm:text-[11px] font-black leading-tight text-slate-900 tracking-wider">
                JOB UTSOB
              </div>
              <div className="text-[11px] sm:text-[13px] font-black leading-none text-emerald-600">
                2026
              </div>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN PRESENTATION STAGE (16:9 Central Area) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!isCardActive ? (
            /* STANDBY BROADCAST STATE (NO DUMMY CARD SHOWCASE) */
            <motion.div
              key="standby-stage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center max-w-3xl"
            >
              {/* Radar Radiating Waves */}
              <div className="relative mb-8 flex items-center justify-center">
                <div className="absolute w-64 h-64 border border-sky-400/25 rounded-full animate-ping [animation-duration:3s]" />
                <div className="absolute w-96 h-96 border border-emerald-400/20 rounded-full animate-ping [animation-duration:5s]" />
                
                <div className="relative z-10 w-32 h-32 bg-white rounded-3xl p-3 shadow-xl border border-slate-200 flex items-center justify-center">
                  <img
                    src="/assets/job-utsob-logo.png"
                    alt="Job Utsob 2026"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Standby Header */}
              <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-slate-900 mb-2">
                DIU JOB UTSOB 2026
              </h2>
            </motion.div>
          ) : (
            /* ACTIVE PERSONALIZED CARD PRESENTATION — PURE UNCLUTTERED 3D CARD */
            <motion.div
              key={`card-${celebrationKey}-${displayState.studentName}`}
              initial={{ opacity: 0, scale: 0.75, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -40 }}
              transition={{
                type: "spring",
                stiffness: 85,
                damping: 18,
                mass: 1.2,
              }}
              className="flex flex-col items-center justify-center my-auto"
            >
              {/* Central Floating 3D Card with Soft Lighting */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotateY: [0, 4, -4, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Glow backdrop */}
                <div className="absolute inset-0 bg-sky-200/50 rounded-[30px] blur-3xl -z-10" />

                <NFCCardTemplate
                  studentName={displayState.studentName || ""}
                  cardImageUrl={displayState.cardImageUrl}
                  size="tv"
                  interactive={false}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER: Event Slogan & Subtle Live Broadcast Status */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/80 bg-white/70 backdrop-blur-md text-[11px] sm:text-xs text-slate-600 text-center sm:text-left">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200 text-[10px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            LIVE VENUE BROADCAST
          </div>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline font-medium text-slate-500">
            Powered by Skill Jobs Smart NFC Technology
          </span>
        </div>

        <div className="font-semibold text-slate-600 tracking-wider text-[10px] sm:text-xs">
          Connecting Job Seekers to Employers • DIU Job Utsob 2026
        </div>
      </footer>
    </div>
  );
}
