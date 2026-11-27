import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DEMO_DIR = path.join(process.cwd(), "public", "demo-cards");

// DELETE /api/admin/demo-cards/[id] — Delete demo card
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const fileName = path.basename(params.id);
    const filePath = path.join(DEMO_DIR, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({
      success: true,
      message: "Demo card deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting demo card:", error);
    return NextResponse.json(
      { error: "Failed to delete demo card" },
      { status: 500 }
    );
  }
}
