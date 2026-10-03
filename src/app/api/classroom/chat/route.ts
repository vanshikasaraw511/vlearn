import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const CHAT_FILE = path.join(process.cwd(), "data", "classroom_chats.json");

async function getStoredChats(): Promise<Record<string, any[]>> {
  try {
    const data = await fs.readFile(CHAT_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveStoredChats(chats: Record<string, any[]>) {
  await fs.mkdir(path.dirname(CHAT_FILE), { recursive: true });
  await fs.writeFile(CHAT_FILE, JSON.stringify(chats, null, 2), "utf-8");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "default";

    const allChats = await getStoredChats();
    const courseMessages = allChats[slug] || [];

    return NextResponse.json({ messages: courseMessages });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch chat" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const allChats = await getStoredChats();
    const courseKey = slug || "default";
    if (!allChats[courseKey]) {
      allChats[courseKey] = [];
    }

    const newMessage = {
      id: Date.now().toString(),
      sender: session.name,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isTeacher: session.role === "INSTRUCTOR" || session.role === "ADMIN",
    };

    allChats[courseKey].push(newMessage);
    await saveStoredChats(allChats);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
