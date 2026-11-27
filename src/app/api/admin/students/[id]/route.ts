import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { generateNfcCardPng } from "@/lib/card-generator";

export const dynamic = "force-dynamic";

// GET /api/admin/students/[id] — Get single student
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const student = await db.student.findUnique({
    where: { id: params.id },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json({ student });
}

// POST /api/admin/students/[id] — Regenerate card or publish to display
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const student = await db.student.findUnique({
    where: { id: params.id },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action || "regenerate"; // "regenerate" or "publish_to_tv"

  try {
    const cardResult = await generateNfcCardPng(student.fullName, student.id);

    const updated = await db.student.update({
      where: { id: student.id },
      data: {
        cardImageUrl: cardResult.relativeUrl,
        cardGeneratedAt: new Date(),
        cardGenerationStatus: "GENERATED",
      },
    });

    if (action === "publish_to_tv" || action === "regenerate") {
      await db.displayState.upsert({
        currentStudentId: updated.id,
        studentName: updated.fullName,
        cardImageUrl: cardResult.relativeUrl,
        mode: "CARD",
        isPaused: false,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Card regenerated and updated on display successfully",
      student: updated,
      card: {
        fileName: cardResult.fileName,
        downloadUrl: cardResult.relativeUrl,
        previewDataUrl: cardResult.dataUrl,
      },
    });
  } catch (error: any) {
    console.error("Error regenerating card:", error);
    return NextResponse.json(
      { error: "Failed to regenerate card" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/students/[id] — Delete student record
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Student record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student record" },
      { status: 500 }
    );
  }
}
