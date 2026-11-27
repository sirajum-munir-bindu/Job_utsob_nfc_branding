import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { generateNfcCardPng } from "@/lib/card-generator";

export const dynamic = "force-dynamic";

const DEMO_DIR = path.join(process.cwd(), "public", "demo-cards");

function ensureDemoDir() {
  if (!fs.existsSync(DEMO_DIR)) {
    fs.mkdirSync(DEMO_DIR, { recursive: true });
  }
}

// GET /api/admin/demo-cards — Get all demo cards
export async function GET() {
  ensureDemoDir();
  const currentDisplay = await db.displayState.get();

  // If directory is empty, seed with 2 default demo cards
  const existingFiles = fs.readdirSync(DEMO_DIR).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  if (existingFiles.length === 0) {
    try {
      const demo1 = await generateNfcCardPng("SIRAJUM MUNIR", "demo_1");
      const demo2 = await generateNfcCardPng("VIP HONORARY GUEST", "demo_2");
      const demo3 = await generateNfcCardPng("SKILL JOBS AMBASSADOR", "demo_3");

      fs.writeFileSync(path.join(DEMO_DIR, "DEMO_SIRAJUM_MUNIR.png"), demo1.buffer);
      fs.writeFileSync(path.join(DEMO_DIR, "DEMO_VIP_HONORARY_GUEST.png"), demo2.buffer);
      fs.writeFileSync(path.join(DEMO_DIR, "DEMO_SKILL_JOBS_AMBASSADOR.png"), demo3.buffer);
    } catch (e) {
      console.error("Error seeding demo cards:", e);
    }
  }

  const files = fs.readdirSync(DEMO_DIR).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));

  const demoCards = files.map((fileName) => {
    const title = fileName
      .replace(/\.(png|jpg|jpeg|webp)$/i, "")
      .replace(/^(DEMO_|demo_)/i, "")
      .replace(/_/g, " ");

    const url = `/demo-cards/${fileName}`;
    const isCurrentlyDisplayed = currentDisplay.cardImageUrl === url;

    return {
      id: fileName,
      fileName,
      title,
      url,
      isCurrentlyDisplayed,
    };
  });

  return NextResponse.json({ demoCards });
}

// POST /api/admin/demo-cards — Upload a new demo card PNG photo
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    ensureDemoDir();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const titleInput = (formData.get("title") as string | null) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeTitle = (titleInput.trim() || file.name.replace(/\.[^/.]+$/, ""))
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-]/g, "")
      .toUpperCase();

    const uniqueId = crypto.randomUUID().slice(0, 8);
    const fileName = `DEMO_${safeTitle}_${uniqueId}.png`;
    const targetPath = path.join(DEMO_DIR, fileName);

    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json({
      success: true,
      message: "Demo card uploaded successfully",
      demoCard: {
        id: fileName,
        fileName,
        title: safeTitle.replace(/_/g, " "),
        url: `/demo-cards/${fileName}`,
        isCurrentlyDisplayed: false,
      },
    });
  } catch (error: any) {
    console.error("Error uploading demo card:", error);
    return NextResponse.json(
      { error: "Failed to upload demo card" },
      { status: 500 }
    );
  }
}
