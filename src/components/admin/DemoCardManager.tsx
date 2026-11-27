"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Tv,
  Download,
  Trash2,
  Sparkles,
  Loader2,
  Plus,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

interface DemoCard {
  id: string;
  fileName: string;
  title: string;
  url: string;
  isCurrentlyDisplayed: boolean;
}

export function DemoCardManager() {
  const [demoCards, setDemoCards] = useState<DemoCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchDemoCards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/demo-cards");
      const data = await res.json();
      if (res.ok) {
        setDemoCards(data.demoCards || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoCards();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", newTitle);

    try {
      const res = await fetch("/api/admin/demo-cards", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast.success("Demo Card Uploaded!", {
        description: `${data.demoCard.title} added to showcase library.`,
      });

      setNewTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDemoCards();
    } catch (err: any) {
      toast.error("Upload Error", { description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const [settingTemplateId, setSettingTemplateId] = useState<string | null>(null);

  const handleSetTemplate = async (card: DemoCard) => {
    setSettingTemplateId(card.id);
    try {
      const res = await fetch("/api/admin/demo-cards/template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: card.fileName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set template");
      toast.success("Card Template Activated! 🎉", {
        description: "All student registrations and live presentation cards will now overwrite names directly onto this picture.",
      });
    } catch (err: any) {
      toast.error("Error setting template", { description: err.message });
    } finally {
      setSettingTemplateId(null);
    }
  };

  const handleBroadcast = async (card: DemoCard) => {
    setBroadcastingId(card.id);
    try {
      const res = await fetch("/api/admin/demo-cards/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: card.url, title: card.title }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Broadcast failed");

      toast.success("Broadcast Live on TV!", {
        description: `Now displaying '${card.title}' on the venue TV screen.`,
      });

      setDemoCards((prev) =>
        prev.map((c) => ({
          ...c,
          isCurrentlyDisplayed: c.id === card.id,
        }))
      );
    } catch (err: any) {
      toast.error("Broadcast Error", { description: err.message });
    } finally {
      setBroadcastingId(null);
    }
  };

  const handleDownload = (card: DemoCard) => {
    const a = document.createElement("a");
    a.href = card.url;
    a.download = card.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async (card: DemoCard) => {
    if (!confirm(`Are you sure you want to delete demo card "${card.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/demo-cards/${encodeURIComponent(card.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.info("Demo card deleted");
        fetchDemoCards();
      }
    } catch (err: any) {
      toast.error("Delete failed", { description: err.message });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 sm:p-7 shadow-sm space-y-5 sm:space-y-6">
      {/* Header and Upload Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-600 shrink-0" />
            Demo & Showcase NFC Cards Library
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold">
              {demoCards.length} Cards
            </span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Add custom demo card PNG photos and broadcast them directly to the venue TV display at any time.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-4 py-2.5 sm:py-2 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-60"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Upload Demo Card PNG</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="text-center py-10 text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-600 mb-2" />
          Loading demo cards...
        </div>
      ) : demoCards.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No Demo Cards Yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click the "Upload Demo Card PNG" button above to add sample cards for testing and display.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {demoCards.map((card) => {
            const isBroadcasting = broadcastingId === card.id;

            return (
              <div
                key={card.id}
                className={`group relative bg-slate-50 hover:bg-white rounded-2xl border transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between ${
                  card.isCurrentlyDisplayed
                    ? "border-emerald-500 ring-2 ring-emerald-400/30 bg-emerald-50/20"
                    : "border-slate-200"
                }`}
              >
                {/* Active TV Badge */}
                {card.isCurrentlyDisplayed && (
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE ON TV
                  </div>
                )}

                {/* Card Thumbnail Image */}
                <div className="relative aspect-[1.586/1] w-full bg-slate-900 rounded-t-xl overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={card.url}
                    alt={card.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>

                {/* Card Details & Actions */}
                <div className="p-3.5 space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide truncate">
                      {card.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                      {card.fileName}
                    </p>
                  </div>

                  {/* Actions: Responsive 2-tier layout */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {/* Broadcast on TV Button */}
                      <button
                        onClick={() => handleBroadcast(card)}
                        disabled={isBroadcasting}
                        className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          card.isCurrentlyDisplayed
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200"
                        }`}
                        title="Display this card on the TV screen right now"
                      >
                        {isBroadcasting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Tv className="w-3.5 h-3.5" />
                        )}
                        <span>{card.isCurrentlyDisplayed ? "Active on TV" : "Display on TV"}</span>
                      </button>

                      {/* Set as Master Template */}
                      <button
                        onClick={() => handleSetTemplate(card)}
                        disabled={settingTemplateId === card.id}
                        className="flex-1 px-2 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        title="Set this card design as the master template for student name overwriting"
                      >
                        {settingTemplateId === card.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        <span>Template</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Download */}
                      <button
                        onClick={() => handleDownload(card)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors text-xs font-semibold"
                        title="Download PNG"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(card)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 transition-colors text-xs font-semibold"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
