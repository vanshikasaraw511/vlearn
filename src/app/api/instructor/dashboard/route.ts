import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized faculty access" }, { status: 401 });
    }

    const instructor = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        coursesTaught: {
          orderBy: { createdAt: "desc" },
          include: {
            enrollments: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
            modules: {
              orderBy: { order: "asc" },
              include: {
                lessons: {
                  orderBy: { order: "asc" },
                },
              },
            },
            assignments: {
              include: {
                submissions: {
                  include: {
                    user: {
                      select: { id: true, name: true, email: true },
                    },
                  },
                },
              },
            },
            quizzes: {
              include: {
                attempts: true,
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      return NextResponse.json({ error: "Instructor record not found" }, { status: 404 });
    }

    return NextResponse.json({ instructor });
  } catch (error: any) {
    console.error("Instructor dashboard fetch error:", error);
    return NextResponse.json({ error: "Failed to load faculty data" }, { status: 500 });
  }
}
