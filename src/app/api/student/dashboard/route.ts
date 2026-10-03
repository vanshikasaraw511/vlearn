import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                instructor: {
                  select: { name: true, email: true },
                },
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
        progress: true,
        submissions: {
          include: {
            assignment: true,
          },
        },
        quizAttempts: {
          include: {
            quiz: true,
          },
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: userData });
  } catch (error: any) {
    console.error("Student dashboard fetch error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
