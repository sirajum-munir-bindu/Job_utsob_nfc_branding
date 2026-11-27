"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@skill.jobs");
  const [password, setPassword] = useState("JobUtsob2026@SkillJobs");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      toast.success("Welcome back!", {
        description: "Authenticated successfully to Job Utsob 2026 Admin Panel.",
      });

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error("Login Failed", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background Soft Color Blooms */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-200/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-200/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl">
        {/* Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500" />

        {/* Header with Logos */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/assets/skill-jobs-logo.png"
              alt="Skill Jobs"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-800 uppercase tracking-wider">
            NFC Card Studio Admin
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
            DIU Job Utsob 2026 • Live Activation Console
          </p>
        </div>

        {error && (
          <div className="mb-5 sm:mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white font-medium transition-all"
                placeholder="admin@skill.jobs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white font-medium transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Credentials Helper Box */}
        <div className="mt-8 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Default Team Credentials
          </div>
          <div className="text-[11px] font-mono text-slate-600 space-y-0.5">
            <div>Email: <span className="text-sky-700 font-bold">admin@skill.jobs</span></div>
            <div>Password: <span className="text-sky-700 font-bold">JobUtsob2026@SkillJobs</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
