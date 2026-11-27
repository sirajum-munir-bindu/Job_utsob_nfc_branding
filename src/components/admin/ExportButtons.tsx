"use client";

import React from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ExportButtons() {
  const [isExportingExcel, setIsExportingExcel] = React.useState(false);

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const response = await fetch("/api/admin/export/excel");
      if (!response.ok) throw new Error("Failed to export Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "JOB_UTSOB_2026_STUDENT_DATA.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Excel exported successfully!");
    } catch (err: any) {
      toast.error("Export Error", { description: err.message });
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={handleExportExcel}
        disabled={isExportingExcel}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-60"
        title="Export full attendee list to styled Excel (.xlsx)"
      >
        {isExportingExcel ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        <span>Export Excel</span>
      </button>
    </div>
  );
}
