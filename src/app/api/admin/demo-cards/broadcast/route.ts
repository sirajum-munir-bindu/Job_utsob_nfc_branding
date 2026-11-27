import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/admin/demo-cards/broadcast — Broadcast demo card to Live TV display
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { url, title } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing card URL" }, { status: 400 });
    }

    const studentName = title || "DEMO NFC PASS";

    // Update Live Display State in persistent storage
    const updatedState = await db.displayState.upsert({
      cardImageUrl: url,
      studentName: studentName,
      mode: "CARD",
      isPaused: false,
    });

    return NextResponse.json({
      success: true,
      message: `Demo card '${studentName}' is now live on the TV display`,
      displayState: updatedState,
    });
  } catch (error: any) {
    console.error("Error broadcasting demo card:", error);
    return NextResponse.json(
      { error: "Failed to broadcast demo card to display" },
      { status: 500 }
    );
  }
}
