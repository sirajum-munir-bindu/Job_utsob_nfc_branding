import ExcelJS from "exceljs";
import { formatDate, formatTime } from "./utils";

export interface StudentExportRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  cardGenerationStatus: string;
  createdAt: Date;
}

export async function generateStudentExcelBuffer(
  students: StudentExportRecord[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Skill Jobs - DIU Job Utsob 2026";
  workbook.lastModifiedBy = "Skill Jobs Admin";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Student Registrations", {
    views: [{ state: "frozen", ySplit: 4 }], // Freeze header rows
    pageSetup: { orientation: "landscape", paperSize: 9 },
  });

  // Title Banner
  worksheet.mergeCells("A1:F1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "DIU JOB UTSOB 2026 — SKILL JOBS LIVE NFC BRANDING DATABASE";
  titleCell.font = {
    name: "Segoe UI",
    size: 14,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0B1527" }, // Brand navy
  };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 36;

  // Subtitle / Metadata
  worksheet.mergeCells("A2:F2");
  const subCell = worksheet.getCell("A2");
  subCell.value = `Exported on: ${new Date().toLocaleString("en-GB")} | Total Registrations: ${students.length}`;
  subCell.font = { name: "Segoe UI", size: 10, italic: true, color: { argb: "FF38BDF8" } };
  subCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF131C31" },
  };
  subCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 22;

  // Empty spacer row 3
  worksheet.getRow(3).height = 10;

  // Headers (Row 4)
  const headers = [
    { header: "SL", key: "sl", width: 8 },
    { header: "Student Name", key: "fullName", width: 34 },
    { header: "Phone Number", key: "phone", width: 20 },
    { header: "Email Address", key: "email", width: 32 },
    { header: "Registration Date", key: "regDate", width: 18 },
    { header: "Registration Time", key: "regTime", width: 18 },
  ];

  const headerRow = worksheet.getRow(4);
  headers.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = h.header;
    cell.font = {
      name: "Segoe UI",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF008751" }, // Job Utsob Green
    };
    cell.alignment = { horizontal: idx === 0 ? "center" : "left", vertical: "middle" };
    cell.border = {
      top: { style: "medium", color: { argb: "FF004D26" } },
      bottom: { style: "medium", color: { argb: "FF004D26" } },
      left: { style: "thin", color: { argb: "FFD1D5DB" } },
      right: { style: "thin", color: { argb: "FFD1D5DB" } },
    };
  });
  headerRow.height = 28;

  // Set column widths
  headers.forEach((h, idx) => {
    worksheet.getColumn(idx + 1).width = h.width;
  });

  // Enable Auto-Filter on data columns
  worksheet.autoFilter = "A4:F4";

  // Data Rows
  students.forEach((student, index) => {
    const rowNumber = index + 5;
    const row = worksheet.getRow(rowNumber);
    const isEven = index % 2 === 0;

    row.values = [
      index + 1,
      student.fullName,
      student.phone,
      student.email,
      formatDate(student.createdAt),
      formatTime(student.createdAt),
    ];

    const rowBgColor = isEven ? "FFFFFFFF" : "FFF8FAFC";

    for (let c = 1; c <= 6; c++) {
      const cell = row.getCell(c);
      cell.font = { name: "Segoe UI", size: 10 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowBgColor },
      };
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: c === 1 ? "center" : "left",
      };
    }
    row.height = 22;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
