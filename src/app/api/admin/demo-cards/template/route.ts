import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// POST /api/admin/demo-cards/template — Set a demo card as the official active card template
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const sourcePath = path.join(process.cwd(), "public", "demo-cards", fileName);
    if (!fs.existsSync(sourcePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const targetPath = path.join(process.cwd(), "public", "assets", "nfc-card-template.png");
    fs.copyFileSync(sourcePath, targetPath);

    return NextResponse.json({
      success: true,
      message: `Card '${fileName}' is now the active master template for all generated cards.`,
    });
  } catch (error: any) {
    console.error("Error setting card template:", error);
    return NextResponse.json(
      { error: "Failed to set master card template" },
      { status: 500 }
    );
  }
}
