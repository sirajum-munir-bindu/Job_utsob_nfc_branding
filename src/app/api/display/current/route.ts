import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/display/current — Public TV Display endpoint (STRICTLY PRIVACY SAFE)
// NEVER returns phone, email, admin credentials or internal database keys
export async function GET() {
  try {
    const state = await db.displayState.get();

    return NextResponse.json({
      mode: state.mode || "WELCOME",
      studentName: state.studentName || null,
      cardImageUrl: state.cardImageUrl || null,
      isPaused: state.isPaused || false,
      updatedAt: state.updatedAt ? state.updatedAt.toISOString() : new Date().toISOString(),
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error) {
    console.error("Error getting display state:", error);
    return NextResponse.json({
      mode: "WELCOME",
      studentName: null,
      cardImageUrl: null,
      isPaused: false,
      updatedAt: new Date().toISOString(),
    });
  }
}
