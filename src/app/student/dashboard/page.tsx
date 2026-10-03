"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Award, 
  PlayCircle, 
  Sparkles, 
  KeyRound, 
  X, 
  AlertCircle, 
  Check,
  Trophy,
  Clock,
  Users,
  BarChart3,
  HelpCircle,
  Globe,
  Lock,
  ChevronRight,
  TrendingUp,
  Flame
} from "lucide-react";

interface QuestionResponse {
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  total: number;
  timeTaken: string;
  isMe?: boolean;
}

interface QuizDetailedRecord {
  id: string;
  title: string;
  type: "PUBLIC" | "PRIVATE";
  courseName?: string;
  score: number;
  total: number;
  timeSpentSeconds: number;
  completedAt: string;
  totalAttendees: number;
  averageScore: number;
  leaderboard: LeaderboardEntry[];
  responses: QuestionResponse[];
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "lessons" | "submissions" | "quizzes">("quizzes");

  // Join Class Modal State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  // Quiz Analytics & Leaderboard Modal State
  const [selectedQuizDetails, setSelectedQuizDetails] = useState<QuizDetailedRecord | null>(null);
  const [modalTab, setModalTab] = useState<"responses" | "leaderboard" | "analytics">("responses");

  // Sample enriched quiz attempts with responses, time taken, and leaderboard
  const [quizHistory, setQuizHistory] = useState<QuizDetailedRecord[]>([
    {
      id: "qa-1",
      title: "Next.js Core Concepts Assessment",
      type: "PUBLIC",
      score: 3,
      total: 3,
      timeSpentSeconds: 104, // 1m 44s
      completedAt: "Oct 3, 2026",
      totalAttendees: 142,
      averageScore: 2.1,
      leaderboard: [
        { rank: 1, name: "Emily Watson", avatar: "👩‍‍🎓", score: 3, total: 3, timeTaken: "1m 15s" },
        { rank: 2, name: "Liam Miller", avatar: "🧑‍💻", score: 3, total: 3, timeTaken: "1m 32s" },
        { rank: 3, name: "Riya (You)", avatar: "🎓", score: 3, total: 3, timeTaken: "1m 44s", isMe: true },
        { rank: 4, name: "Aarav Sharma", avatar: "👨‍🎓", score: 2, total: 3, timeTaken: "2m 10s" },
        { rank: 5, name: "Sophia Chen", avatar: "👩‍🔬", score: 2, total: 3, timeTaken: "2m 35s" }
      ],
      responses: [
        {
          prompt: "By default, components inside Next.js App Router are:",
          userAnswer: "React Server Components (RSC)",
          correctAnswer: "React Server Components (RSC)",
          isCorrect: true,
          explanation: "In Next.js App Router, all files in the app folder are React Server Components by default unless marked with 'use client'."
        },
        {
          prompt: "Which hook is used to access route search query parameters in Client Components?",
          userAnswer: "useSearchParams",
          correctAnswer: "useSearchParams",
          isCorrect: true,
          explanation: "useSearchParams returns a read-only URLSearchParams object to inspect search parameters."
        },
        {
          prompt: "True or False: Prisma can be executed directly inside client-side components.",
          userAnswer: "False",
          correctAnswer: "False",
          isCorrect: true,
          explanation: "Prisma runs in Node.js server environments and cannot run securely in client bundles."
        }
      ]
    },
    {
      id: "qa-2",
      title: "Module 1 Architecture Exam",
      type: "PRIVATE",
      courseName: "Advanced Full-Stack Engineering",
      score: 4,
      total: 5,
      timeSpentSeconds: 195, // 3m 15s
      completedAt: "Oct 2, 2026",
      totalAttendees: 28,
      averageScore: 3.4,
      leaderboard: [
        { rank: 1, name: "Riya (You)", avatar: "🎓", score: 4, total: 5, timeTaken: "3m 15s", isMe: true },
        { rank: 2, name: "Liam Miller", avatar: "🧑‍💻", score: 4, total: 5, timeTaken: "3m 42s" },
        { rank: 3, name: "Kabir Mehta", avatar: "👨‍💻", score: 3, total: 5, timeTaken: "4m 10s" },
        { rank: 4, name: "Ananya Roy", avatar: "👩‍🎓", score: 3, total: 5, timeTaken: "4m 28s" }
      ],
      responses: [
        {
          prompt: "What happens when a Server Action throws an uncaught error?",
          userAnswer: "It triggers the nearest error.tsx error boundary on the client",
          correctAnswer: "It triggers the nearest error.tsx error boundary on the client",
          isCorrect: true,
          explanation: "Errors in server actions reject the invoking Promise and trigger the client error boundary."
        },
        {
          prompt: "Where should database secrets and JWT private keys be stored?",
          userAnswer: "Client LocalStorage",
          correctAnswer: "Server Environment Variables (.env)",
          isCorrect: false,
          explanation: "Sensitive keys must never be exposed to browser storage; they belong strictly in server environment variables."
        },
        {
          prompt: "What is the primary benefit of streaming with Suspense in Next.js?",
          userAnswer: "Progressively renders parts of the page as data loads without blocking the UI",
          correctAnswer: "Progressively renders parts of the page as data loads without blocking the UI",
          isCorrect: true,
          explanation: "Suspense allows fast initial UI paint while slower server promises stream into place."
        },
        {
          prompt: "Which HTTP-only cookie attribute prevents CSRF attacks?",
          userAnswer: "SameSite=Lax or SameSite=Strict",
          correctAnswer: "SameSite=Lax or SameSite=Strict",
          isCorrect: true,
          explanation: "The SameSite cookie flag prevents cookies from being dispatched on third-party cross-origin requests."
        },
        {
          prompt: "Can SQLite support concurrent production write transactions across multi-server pods?",
          userAnswer: "No, SQLite locks the entire database file on write",
          correctAnswer: "No, SQLite locks the entire database file on write",
          isCorrect: true,
          explanation: "SQLite uses file locks; distributed high-write microservices typically require PostgreSQL or distributed Raft databases."
        }
      ]
    }
  ]);

  const loadDashboardData = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load");
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [router]);

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    setJoinError("");
    setJoinSuccess("");

    try {
      const res = await fetch("/api/courses/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: classCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to join class");
      }

      setJoinSuccess(`Enrolled successfully in ${data.course.title}! 🎉`);
      setClassCode("");
      await loadDashboardData();

      setTimeout(() => {
        setShowJoinModal(false);
        setJoinSuccess("");
      }, 1200);
    } catch (err: any) {
      setJoinError(err.message || "Invalid class code. Please check with your teacher.");
    } finally {
      setJoining(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    if (mins === 0) return `${rem}s`;
    return `${mins}m ${rem}s`;
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-500 font-bold text-sm">Loading Student Workspace...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const enrollments = user.enrollments || [];
  const progressList = user.progress || [];
  const submissionsList = user.submissions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl shadow-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Student Campus Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            Track ongoing coursework, inspect quiz performance & rankings, or join a teacher&apos;s class with your code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setJoinError("");
              setJoinSuccess("");
              setShowJoinModal(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-indigo-700 font-extrabold text-sm shadow-xl shadow-indigo-950/20 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <KeyRound className="w-5 h-5 text-indigo-600" /> 🔑 Join New Class
          </button>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md transition-colors"
          >
            <BookOpen className="w-4 h-4" /> Catalog
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          👇 Click a card to view detailed records:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab("courses")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "courses"
                ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-indigo-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Courses</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{enrollments.length}</p>
            <span className="text-[11px] font-bold text-indigo-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "courses" ? "● Active View" : "View classes →"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lessons")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "lessons"
                ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Lessons</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{progressList.length}</p>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "lessons" ? "● Active View" : "View lessons →"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "submissions"
                ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Tasks</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{submissionsList.length}</p>
            <span className="text-[11px] font-bold text-blue-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "submissions" ? "● Active View" : "View tasks →"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("quizzes")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "quizzes"
                ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-purple-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quizzes Taken</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{quizHistory.length}</p>
            <span className="text-[11px] font-bold text-purple-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "quizzes" ? "● Active View" : "View analytics →"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* TAB: QUIZZES WITH ANALYTICS, LEADERBOARD, AND PUBLIC/PRIVATE SECTIONS */}
          {activeTab === "quizzes" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" /> Quiz Assessments & Analytics ({quizHistory.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any completed quiz below to inspect your answers, time spent, and class leaderboard.
                  </p>
                </div>
              </div>

              {/* Clarification Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-md bg-blue-100 text-blue-700 mt-0.5">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">🌐 Public Quizzes:</span>
                    <p className="text-[11px] text-slate-500">Open to any campus learner directly from the workspace.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-md bg-purple-100 text-purple-700 mt-0.5">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">🔒 Private Quizzes:</span>
                    <p className="text-[11px] text-slate-500">Classroom-only assessments strictly for enrolled students.</p>
                  </div>
                </div>
              </div>

              {/* Quiz Cards */}
              <div className="space-y-4">
                {quizHistory.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuizDetails(q);
                      setModalTab("responses");
                    }}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all bg-white cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {q.type === "PUBLIC" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                            <Globe className="w-3 h-3" /> Public Campus Quiz
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                            <Lock className="w-3 h-3" /> Private Class Quiz • {q.courseName}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">Completed: {q.completedAt}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {q.title}
                      </h3>

                      {/* Quick Meta: Time taken & Attendance */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" /> Time Taken: <strong className="text-slate-800 font-mono">{formatSeconds(q.timeSpentSeconds)}</strong>
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Users className="w-3.5 h-3.5 text-emerald-500" /> {q.totalAttendees} Students Attended
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Score: {q.score} / {q.total} (Passed ✓)
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                        View Analytics & Ranks <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ENROLLED COURSES */}
          {activeTab === "courses" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> My Classes ({enrollments.length})
              </h2>
              <div className="space-y-4">
                {enrollments.map((enr: any) => (
                  <div key={enr.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md font-bold">
                        Code: {enr.course.joinCode || "VL-NX742"}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base mt-1">{enr.course.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{enr.course.description}</p>
                    </div>
                    <Link
                      href={`/learn/${enr.course.slug}/${enr.course.modules?.[0]?.lessons?.[0]?.id || "l1"}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold self-start"
                    >
                      <PlayCircle className="w-4 h-4" /> Enter Classroom
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LESSONS */}
          {activeTab === "lessons" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Completed Lessons ({progressList.length})
              </h2>
              {progressList.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between border-b border-slate-100">
                  <p className="font-bold text-slate-900 text-xs">Lesson: {item.lessonId}</p>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-xs border border-emerald-200">
                    Completed ✓
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SUBMISSIONS */}
          {activeTab === "submissions" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Submitted Tasks ({submissionsList.length})
              </h2>
              {submissionsList.map((sub: any) => (
                <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">{sub.assignment?.title || "Assignment"}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Score: {sub.score}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic">&quot;{sub.feedback}&quot;</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Notices */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              📢 Notice Board
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                <p className="text-xs font-bold text-purple-900">🏆 Campus Quiz Challenge Live</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  The Next.js Core Assessment is open to all students. Check your rank on the leaderboard!
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-800">Welcome to VLearn!</p>
                <p className="text-[11px] text-slate-500 mt-1">You are ready to learn, take assessments, and collaborate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ DETAILED ANALYTICS, LEADERBOARD & RESPONSES MODAL */}
      {selectedQuizDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-b border-slate-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {selectedQuizDetails.type === "PUBLIC" ? (
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Public Campus Quiz
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Private Class Assessment
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-slate-500">
                    Completed on {selectedQuizDetails.completedAt}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{selectedQuizDetails.title}</h3>
              </div>
              <button
                onClick={() => setSelectedQuizDetails(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Top Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200 text-center">
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Your Score</span>
                <p className="text-xl font-black text-purple-700 mt-0.5">
                  {selectedQuizDetails.score} / {selectedQuizDetails.total}
                </p>
                <span className="text-[10px] font-bold text-emerald-600">Passed ✓</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Taken</span>
                <p className="text-xl font-black font-mono text-slate-900 mt-0.5">
                  {formatSeconds(selectedQuizDetails.timeSpentSeconds)}
                </p>
                <span className="text-[10px] font-semibold text-slate-500">Duration</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Attended</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedQuizDetails.totalAttendees}
                </p>
                <span className="text-[10px] font-semibold text-slate-500">Students</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Class Average</span>
                <p className="text-xl font-black text-indigo-600 mt-0.5">
                  {selectedQuizDetails.averageScore} / {selectedQuizDetails.total}
                </p>
                <span className="text-[10px] font-semibold text-slate-500">Average Score</span>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6">
              <button
                onClick={() => setModalTab("responses")}
                className={`py-3.5 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalTab === "responses"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <HelpCircle className="w-4 h-4" /> My Responses ({selectedQuizDetails.responses.length})
              </button>
              <button
                onClick={() => setModalTab("leaderboard")}
                className={`py-3.5 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalTab === "leaderboard"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard Ranking
              </button>
              <button
                onClick={() => setModalTab("analytics")}
                className={`py-3.5 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalTab === "analytics"
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-indigo-500" /> Performance Analytics
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              
              {/* TAB 1: MY RESPONSES */}
              {modalTab === "responses" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Question-by-Question Response Audit
                    </h4>
                    <span className="text-xs font-bold text-slate-600">
                      Accuracy: {Math.round((selectedQuizDetails.score / selectedQuizDetails.total) * 100)}%
                    </span>
                  </div>

                  {selectedQuizDetails.responses.map((resp, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        resp.isCorrect ? "bg-emerald-50/40 border-emerald-200" : "bg-rose-50/40 border-rose-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-black text-slate-900">
                          {idx + 1}. {resp.prompt}
                        </p>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                            resp.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {resp.isCorrect ? "Correct ✓" : "Incorrect ✗"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Your Chosen Answer</span>
                          <p className={`font-semibold mt-0.5 ${resp.isCorrect ? "text-emerald-700" : "text-rose-600"}`}>
                            {resp.userAnswer}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-400">Correct Answer</span>
                          <p className="font-semibold text-slate-800 mt-0.5">
                            {resp.correctAnswer}
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/70 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-slate-800 font-bold">💡 Solution Rationale: </strong>
                        {resp.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: LEADERBOARD */}
              {modalTab === "leaderboard" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Top Performers & Rank List
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Ranked by highest score and fastest completion time.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" /> Live Rankings
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {selectedQuizDetails.leaderboard.map((item) => (
                      <div
                        key={item.rank}
                        className={`p-3.5 flex items-center justify-between transition-colors ${
                          item.isMe ? "bg-purple-50/80 font-bold border-l-4 border-l-purple-600" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                            item.rank === 1 ? "bg-amber-100 text-amber-800" :
                            item.rank === 2 ? "bg-slate-200 text-slate-700" :
                            item.rank === 3 ? "bg-amber-50 text-amber-900 border border-amber-300" : "bg-slate-100 text-slate-500"
                          }`}>
                            {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                          </div>
                          <span className="text-lg">{item.avatar}</span>
                          <div>
                            <p className="text-xs font-black text-slate-900 flex items-center gap-1">
                              {item.name}
                              {item.isMe && (
                                <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded-md font-bold">
                                  You
                                </span>
                              )}
                            </p>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" /> Time: {item.timeTaken}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black text-purple-700">
                            {item.score} / {item.total} pts
                          </p>
                          <span className="text-[10px] font-semibold text-emerald-600">Passed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PERFORMANCE ANALYTICS */}
              {modalTab === "analytics" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Comparative Score Analytics
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Percentile Standing
                      </p>
                      <p className="text-2xl font-black text-slate-900">Top 5%</p>
                      <p className="text-xs text-slate-500">
                        You scored higher than {Math.round((1 - 1 / selectedQuizDetails.totalAttendees) * 100)}% of the {selectedQuizDetails.totalAttendees} participating students.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-600" /> Speed Analysis
                      </p>
                      <p className="text-2xl font-black font-mono text-slate-900">
                        {Math.round(selectedQuizDetails.timeSpentSeconds / selectedQuizDetails.total)}s / question
                      </p>
                      <p className="text-xs text-slate-500">
                        Average response speed was 34% faster than the campus average.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedQuizDetails(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-800"
              >
                Close Audit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* JOIN CLASS MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Enrollment</span>
                <h3 className="text-lg font-black text-slate-900">Join a New Class 🎓</h3>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinClass} className="p-6 space-y-4">
              {joinError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {joinError}
                </div>
              )}

              {joinSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" /> {joinSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Enter Class Join Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VL-NX742"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono font-black tracking-widest uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                  Enter the code provided by your instructor.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={joining || !classCode.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {joining ? "Joining..." : "Join Class 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
