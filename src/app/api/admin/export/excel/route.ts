import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { generateStudentExcelBuffer } from "@/lib/export-excel";

// GET /api/admin/export/excel — Export all student data to formatted Excel
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Export ALL student records, ordered by registration time
    const students = await db.student.findMany({
      orderBy: { createdAt: "desc" },
    });

    const buffer = await generateStudentExcelBuffer(students);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="JOB_UTSOB_2026_STUDENT_DATA.xlsx"',
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating Excel export:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel export" },
      { status: 500 }
    );
  }
}
