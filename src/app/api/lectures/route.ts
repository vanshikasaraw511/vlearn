import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const LECTURES_FILE = path.join(process.cwd(), "data", "classroom_lectures.json");

async function getStoredLectures(): Promise<Record<string, any[]>> {
  try {
    const data = await fs.readFile(LECTURES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveStoredLectures(lectures: Record<string, any[]>) {
  await fs.mkdir(path.dirname(LECTURES_FILE), { recursive: true });
  await fs.writeFile(LECTURES_FILE, JSON.stringify(lectures, null, 2), "utf-8");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "default";

    const allLectures = await getStoredLectures();
    return NextResponse.json({ lectures: allLectures[slug] || [] });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch lectures" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug, title, description, videoUrl, attachmentUrl, durationMin } = await req.json();

    const allLectures = await getStoredLectures();
    const courseKey = slug || "default";
    if (!allLectures[courseKey]) {
      allLectures[courseKey] = [];
    }

    const newLecture = {
      id: Date.now().toString(),
      title,
      description,
      videoUrl: videoUrl || undefined,
      attachmentUrl: attachmentUrl || undefined,
      durationMin: Number(durationMin) || 15,
      createdAt: new Date().toISOString(),
    };

    allLectures[courseKey].push(newLecture);
    await saveStoredLectures(allLectures);

    return NextResponse.json({ success: true, lecture: newLecture });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to save lecture" }, { status: 500 });
  }
}
