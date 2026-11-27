"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { toast } from "sonner";

interface Student {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  cardImageUrl: string | null;
  cardGeneratedAt: string | null;
  cardGenerationStatus: string;
  createdAt: string;
}

interface StudentTableProps {
  refreshTrigger: number;
  onPreviewCard?: (student: Student) => void;
}

export function StudentTable({ refreshTrigger }: StudentTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [operatingId, setOperatingId] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const url = `/api/admin/students?page=${page}&limit=10&search=${encodeURIComponent(
        search
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStudents(data.students || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (e: any) {
      toast.error("Failed to load students", { description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, refreshTrigger]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  const handleDownloadCard = (student: Student) => {
    if (!student.cardImageUrl) {
      toast.error("No card image generated for this student yet.");
      return;
    }
    const a = document.createElement("a");
    a.href = student.cardImageUrl;
    a.download = `JOB_UTSOB_2026_${student.fullName.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRegenerate = async (student: Student) => {
    setOperatingId(student.id);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "regenerate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Card regenerated and published to TV!");
      fetchStudents();
    } catch (e: any) {
      toast.error("Regeneration failed", { description: e.message });
    } finally {
      setOperatingId(null);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Delete record for ${student.fullName}?`)) return;

    setOperatingId(student.id);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Student record deleted");
      fetchStudents();
    } catch (e: any) {
      toast.error("Delete failed", { description: e.message });
    } finally {
      setOperatingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 sm:p-7 shadow-sm">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            Attendee Database & Cards
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold">
              {totalCount} Total
            </span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Real-time collected attendee records, status, and high-res PNG cards.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white font-medium"
          />
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-2 sm:px-4">SL</th>
              <th className="py-3 px-3 sm:px-4">Student</th>
              <th className="hidden sm:table-cell py-3 px-3 sm:px-4">Phone</th>
              <th className="hidden md:table-cell py-3 px-3 sm:px-4">Email</th>
              <th className="hidden lg:table-cell py-3 px-3 sm:px-4">Time</th>
              <th className="py-3 px-2 sm:px-4">Status</th>
              <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-600 mb-2" />
                  Loading attendee records...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  No student records found. Enter an attendee above to generate their first card.
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const sl = (page - 1) * 10 + idx + 1;
                const isOp = operatingId === student.id;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 sm:px-4 font-mono text-slate-400 text-[11px]">{sl}</td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-bold text-slate-900 uppercase tracking-wide text-xs sm:text-sm">
                        {student.fullName}
                      </div>
                      {/* Mobile phone & email subtitle */}
                      <div className="sm:hidden text-[10px] text-slate-500 font-mono mt-0.5 space-y-0.5">
                        <div>{student.phone}</div>
                        <div className="truncate max-w-[130px] text-slate-400">{student.email}</div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-3 px-3 sm:px-4 font-mono text-slate-600">{student.phone}</td>
                    <td className="hidden md:table-cell py-3 px-3 sm:px-4 text-slate-600 truncate max-w-[180px]">{student.email}</td>
                    <td className="hidden lg:table-cell py-3 px-3 sm:px-4 text-slate-500 whitespace-nowrap">
                      {formatTime(student.createdAt)}
                    </td>
                    <td className="py-3 px-2 sm:px-4">
                      {student.cardGenerationStatus === "GENERATED" ? (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="hidden xs:inline sm:inline">Generated</span>
                        </span>
                      ) : student.cardGenerationStatus === "FAILED" ? (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
                          <span className="hidden xs:inline sm:inline">Failed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="hidden xs:inline sm:inline">Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                        {/* Download PNG */}
                        <button
                          onClick={() => handleDownloadCard(student)}
                          disabled={!student.cardImageUrl}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Download Card PNG"
                        >
                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        {/* Regenerate / Broadcast to TV */}
                        <button
                          onClick={() => handleRegenerate(student)}
                          disabled={isOp}
                          className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg transition-colors disabled:opacity-50"
                          title="Regenerate & Broadcast to TV"
                        >
                          {isOp ? (
                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                          ) : (
                            <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </button>

                        {/* Delete Record */}
                        <button
                          onClick={() => handleDeleteStudent(student)}
                          disabled={isOp}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <div>
          Showing page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
