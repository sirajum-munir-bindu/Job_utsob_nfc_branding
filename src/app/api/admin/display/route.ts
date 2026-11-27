import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

// POST /api/admin/display — Admin Display Controls
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body; // "pause", "resume", "welcome", "clear"

    let updateData: any = {};

    if (action === "pause") {
      updateData = { isPaused: true };
    } else if (action === "resume") {
      updateData = { isPaused: false };
    } else if (action === "welcome") {
      updateData = {
        mode: "WELCOME",
        currentStudentId: null,
        studentName: null,
        cardImageUrl: null,
        isPaused: false,
      };
    } else if (action === "set_mode") {
      updateData = { mode: body.mode || "CARD" };
    }

    const state = await db.displayState.upsert(updateData);

    return NextResponse.json({
      success: true,
      message: `Display action '${action}' applied successfully`,
      state,
    });
  } catch (error) {
    console.error("Display control error:", error);
    return NextResponse.json(
      { error: "Failed to update display state" },
      { status: 500 }
    );
  }
}
