import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const QUIZ_FILE = path.join(process.cwd(), "data", "classroom_quizzes.json");

async function getStoredQuizzes(): Promise<Record<string, any[]>> {
  try {
    const data = await fs.readFile(QUIZ_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveStoredQuizzes(quizzes: Record<string, any[]>) {
  await fs.mkdir(path.dirname(QUIZ_FILE), { recursive: true });
  await fs.writeFile(QUIZ_FILE, JSON.stringify(quizzes, null, 2), "utf-8");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "default";

    const allQuizzes = await getStoredQuizzes();
    return NextResponse.json({ quizzes: allQuizzes[slug] || [] });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, slug } = body;
    const courseKey = slug || "default";
    const allQuizzes = await getStoredQuizzes();
    if (!allQuizzes[courseKey]) {
      allQuizzes[courseKey] = [];
    }

    // Handle student quiz submission
    if (action === "SUBMIT_ATTEMPT") {
      const { quizId, score, timeTakenSeconds } = body;
      const quizIndex = allQuizzes[courseKey].findIndex((q) => q.id === quizId);

      if (quizIndex === -1) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      const submissionRecord = {
        studentId: session.id,
        studentName: session.name,
        studentAvatar: "🎓",
        score,
        timeTakenSeconds,
        submittedAt: new Date().toLocaleDateString(),
      };

      allQuizzes[courseKey][quizIndex].submissions = [
        ...(allQuizzes[courseKey][quizIndex].submissions || []),
        submissionRecord,
      ];

      await saveStoredQuizzes(allQuizzes);
      return NextResponse.json({ success: true, submission: submissionRecord });
    }

    // Handle teacher publishing a new quiz
    const {
      title,
      totalQuestions,
      totalMarks,
      durationMinutes,
      deadline,
      targetAudience,
      selectedStudentIds,
      questions,
    } = body;

    const newQuiz = {
      id: "q-" + Date.now(),
      title,
      totalQuestions: Number(totalQuestions) || questions?.length || 1,
      totalMarks: Number(totalMarks) || 10,
      durationMinutes: Number(durationMinutes) || 15,
      deadline: deadline || "2026-10-15 23:59",
      targetAudience: targetAudience || "ALL",
      selectedStudentIds: selectedStudentIds || [],
      questions: questions || [],
      submissions: [],
      createdAt: new Date().toISOString(),
    };

    allQuizzes[courseKey].push(newQuiz);
    await saveStoredQuizzes(allQuizzes);

    return NextResponse.json({ success: true, quiz: newQuiz });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save quiz" }, { status: 500 });
  }
}
