import { NextRequest, NextResponse } from "next/server";
import { AdminLoginSchema } from "@/lib/validations";
import { setAdminSession, verifyAdminCredentials } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AdminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const isValid = verifyAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await setAdminSession(email, "Skill Jobs Admin");

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
      user: { email, name: "Skill Jobs Admin" },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
