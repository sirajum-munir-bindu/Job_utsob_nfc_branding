"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentForm } from "@/components/admin/StudentForm";
import { NFCCardTemplate } from "@/components/card/NFCCardTemplate";
import { CardPreviewModal } from "@/components/admin/CardPreviewModal";
import { StudentTable } from "@/components/admin/StudentTable";
import { DemoCardManager } from "@/components/admin/DemoCardManager";
import { ExportButtons } from "@/components/admin/ExportButtons";
import { DisplayControls } from "@/components/admin/DisplayControls";
import {
  Download,
  LogOut,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const router = useRouter();
  const [liveTypingName, setLiveTypingName] = useState("");
  const [latestStudent, setLatestStudent] = useState<any>(null);
  const [latestCard, setLatestCard] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [refreshTableCount, setRefreshTableCount] = useState(0);

  const handleFormSuccess = (student: any, card: any) => {
    setLatestStudent(student);
    setLatestCard(card);
    setIsPreviewModalOpen(true);
    setRefreshTableCount((prev) => prev + 1);
  };

  const handleTablePreview = (student: any) => {
    setLatestStudent(student);
    setLatestCard({
      fileName: `JOB_UTSOB_2026_${student.fullName.replace(/\s+/g, "_")}.png`,
      downloadUrl: student.cardImageUrl,
    });
    setIsPreviewModalOpen(true);
  };

  const handleDownloadLatest = () => {
    if (!latestCard?.downloadUrl) return;
    const a = document.createElement("a");
    a.href = latestCard.downloadUrl;
    a.download = latestCard.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.info("Logged out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden">
      {/* Background Job Utsob Watermark - Big & Vivid */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.14] mix-blend-multiply -z-10">
        <div className="w-[1050px] h-[1050px]">
          <img
            src="/assets/job-utsob-bg.png"
            alt="Job Utsob 2026 Background"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 shadow-sm">
        {/* Left: Branding & Event Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src="/assets/skill-jobs-logo.png"
            alt="Skill Jobs"
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
          <div className="min-w-0 border-l border-slate-200 pl-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Admin Panel
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate">
              DIU Job Utsob 2026 • Live NFC Console
            </p>
          </div>
        </div>

        {/* Right: Export & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ExportButtons />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 text-xs font-semibold shadow-sm transition-colors"
            title="Log out from admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* SUB-HEADER TOOLBAR: Live TV Display Controls */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <DisplayControls />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 space-y-8">
        {/* UPPER GRID: Form on left, Live Card Preview on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Student Information Form */}
          <div className="lg:col-span-6 space-y-4">
            <StudentForm
              onSuccess={handleFormSuccess}
              onNameChange={setLiveTypingName}
            />
          </div>

          {/* RIGHT: Live Interactive Card Studio Preview */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm relative overflow-hidden">
            {/* Ambient Backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-100 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  Live Card Personalization Preview
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Real-time visualization matching the venue TV display and downloadable PNG.
                </p>
              </div>

              {latestCard?.downloadUrl && (
                <button
                  onClick={handleDownloadLatest}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  Download PNG
                </button>
              )}
            </div>

            {/* 3D Card Preview */}
            <div className="my-2 w-full flex justify-center">
              <NFCCardTemplate
                studentName={
                  liveTypingName ||
                  latestStudent?.fullName ||
                  "STUDENT NAME"
                }
                cardImageUrl={
                  !liveTypingName && latestCard?.downloadUrl
                    ? latestCard.downloadUrl
                    : null
                }
                size="lg"
                interactive={true}
              />
            </div>

            <div className="w-full mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] sm:text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Exact dimensions: 1200 × 756 px @ 300 DPI</span>
              </div>
              <span className="font-mono text-slate-400">Lossless CR80 Standard</span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Demo & Showcase Cards Studio */}
        <section className="pt-2">
          <DemoCardManager />
        </section>

        {/* LOWER SECTION: Student Management Records Table */}
        <section className="pt-2">
          <StudentTable
            refreshTrigger={refreshTableCount}
            onPreviewCard={handleTablePreview}
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white/60 py-4 px-6 text-center text-xs text-slate-500">
        DIU Job Utsob 2026 • Skill Jobs Smart NFC Activation System • Career Development Center (CDC)
      </footer>

      {/* CARD GENERATION SUCCESS MODAL */}
      <CardPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        student={latestStudent}
        card={latestCard}
        onGenerateAnother={() => setIsPreviewModalOpen(false)}
      />
    </div>
  );
}
