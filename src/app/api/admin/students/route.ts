import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { StudentFormSchema } from "@/lib/validations";
import { generateNfcCardPng } from "@/lib/card-generator";

export const dynamic = "force-dynamic";

// GET /api/admin/students — List students with pagination, search, filter
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));
  const skip = (page - 1) * limit;

  try {
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [students, totalCount] = await Promise.all([
      db.student.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.student.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      students,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch student records" },
      { status: 500 }
    );
  }
}

// POST /api/admin/students — Register student, generate card, publish to display
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = StudentFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, phone, email } = validation.data;

    // Create attendee record in database
    let student = await db.student.create({
      data: {
        fullName,
        phone,
        email,
        cardGenerationStatus: "PENDING",
      },
    });

    // Generate high-resolution personalized NFC Card PNG
    let cardResult;
    try {
      cardResult = await generateNfcCardPng(student.fullName, student.id);

      student = await db.student.update({
        where: { id: student.id },
        data: {
          cardImageUrl: cardResult.relativeUrl,
          cardGeneratedAt: new Date(),
          cardGenerationStatus: "GENERATED",
        },
      });
    } catch (genError) {
      console.error("Card generation failed:", genError);
      await db.student.update({
        where: { id: student.id },
        data: { cardGenerationStatus: "FAILED" },
      });
      return NextResponse.json(
        { error: "Card generation failed. Please try again." },
        { status: 500 }
      );
    }

    // Publish to persistent Live Display State
    await db.displayState.upsert({
      currentStudentId: student.id,
      studentName: student.fullName,
      cardImageUrl: cardResult.relativeUrl,
      mode: "CARD",
      isPaused: false,
    });

    return NextResponse.json({
      success: true,
      message: "Card generated and published to Live Display successfully",
      student,
      card: {
        fileName: cardResult.fileName,
        downloadUrl: cardResult.relativeUrl,
        previewDataUrl: cardResult.dataUrl,
      },
    });
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process student registration" },
      { status: 500 }
    );
  }
}
