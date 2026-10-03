import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "VL-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized faculty access" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, difficulty, assignmentTitle, assignmentDesc } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const joinCode = generateCode();

    const newCourse = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        difficulty: difficulty || "BEGINNER",
        joinCode,
        instructorId: session.id,
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        durationHours: 10.0,
        modules: {
          create: [
            {
              title: "Module 1: Orientation & Overview",
              order: 1,
              lessons: {
                create: [
                  {
                    title: "Welcome to " + title,
                    content: "Welcome to our class! Check out posted announcements and assignments.",
                    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                    durationMin: 15,
                    order: 1,
                  },
                ],
              },
            },
          ],
        },
        assignments: assignmentTitle
          ? {
              create: [
                {
                  title: assignmentTitle,
                  description: assignmentDesc || "Complete the task and submit your link.",
                  maxScore: 100,
                },
              ],
            }
          : undefined,
      },
      include: {
        modules: { include: { lessons: true } },
        assignments: true,
      },
    });

    return NextResponse.json({ course: newCourse });
  } catch (error: any) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create class" },
      { status: 500 }
    );
  }
}
