import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await req.json();
    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
    }

    const existing = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId,
        },
      },
    });

    if (existing) {
      await prisma.progress.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ completed: false });
    } else {
      await prisma.progress.create({
        data: {
          userId: session.id,
          lessonId,
          completed: true,
        },
      });
      return NextResponse.json({ completed: true });
    }
  } catch (error) {
    console.error("Progress toggle error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
