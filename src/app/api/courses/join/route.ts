import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Please log in first" }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Class code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const course = await prisma.course.findFirst({
      where: {
        OR: [{ joinCode: cleanCode }, { joinCode: "VL-" + cleanCode }],
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Invalid class code. Please check with your teacher." },
        { status: 404 }
      );
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "You are already enrolled in this class!", course });
    }

    await prisma.enrollment.create({
      data: {
        userId: session.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error("Join class error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to join class" },
      { status: 500 }
    );
  }
}
