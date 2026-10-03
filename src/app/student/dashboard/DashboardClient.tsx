"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Award, 
  PlayCircle, 
  Sparkles, 
  ChevronRight,
  X
} from "lucide-react";

function formatDate(dateInput: string | Date | undefined) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  return d.toISOString().split("T")[0];
}

export default function DashboardClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"courses" | "lessons" | "submissions" | "quizzes">("courses");
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);

  const totalCourses = user.enrollments.length;
  const completedLessons = user.progress.filter((p: any) => p.completed);
  const totalSubmissions = user.submissions;
  const quizAttempts = user.quizAttempts;

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
            Click on any stat card below to inspect your quiz results, completed lessons, assignments, and curriculum progress.
          </p>
        </div>
        <Link
          href="/courses"
          className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 font-extrabold text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-105"
        >
          <BookOpen className="w-4 h-4" /> Browse Catalog 🚀
        </Link>
      </div>

      {/* Interactive Clickable Metric Cards */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          👇 Click a card to view detailed records:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Enrolled Courses */}
          <button
            onClick={() => setActiveTab("courses")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "courses"
                ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Courses</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{totalCourses}</p>
            <span className="text-[11px] font-bold text-indigo-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "courses" ? "● Active View" : "Click to view courses →"}
            </span>
          </button>

          {/* Card 2: Completed Lessons */}
          <button
            onClick={() => setActiveTab("lessons")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "lessons"
                ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Lessons</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{completedLessons.length}</p>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "lessons" ? "● Active View" : "Click to view lessons →"}
            </span>
          </button>

          {/* Card 3: Submitted Tasks */}
          <button
            onClick={() => setActiveTab("submissions")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "submissions"
                ? "bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Tasks</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{totalSubmissions.length}</p>
            <span className="text-[11px] font-bold text-blue-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "submissions" ? "● Active View" : "Click to view tasks →"}
            </span>
          </button>

          {/* Card 4: Quizzes Taken */}
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "quizzes"
                ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-md shadow-purple-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quizzes Taken</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{quizAttempts.length}</p>
            <span className="text-[11px] font-bold text-purple-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "quizzes" ? "● Active View" : "Click to view quiz details →"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Dynamic Detail Panel based on Selected Card */}
        <div className="lg:col-span-2 space-y-6">

          {/* TAB 1: ENROLLED COURSES */}
          {activeTab === "courses" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" /> My Enrolled Courses ({user.enrollments.length})
                  </h2>
                  <p className="text-xs text-slate-500">Resume your lectures and track overall module progress.</p>
                </div>
                <Link href="/courses" className="text-xs font-bold text-indigo-600 hover:underline">
                  Catalog &rarr;
                </Link>
              </div>

              <div className="space-y-4">
                {user.enrollments.map((enr: any) => {
                  const totalLessons = enr.course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);
                  const firstLesson = enr.course.modules[0]?.lessons[0];

                  return (
                    <div
                      key={enr.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 bg-slate-50/50"
                    >
                      <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden relative shrink-0 bg-slate-200">
                        {enr.course.thumbnail && (
                          <img
                            src={enr.course.thumbnail}
                            alt={enr.course.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                          {enr.course.difficulty}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">{enr.course.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{enr.course.description}</p>
                          <p className="text-xs font-semibold text-slate-600 mt-2">
                            👨‍🏫 Faculty: {enr.course.instructor.name}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">{totalLessons} Total Lessons</span>
                          {firstLesson && (
                            <Link
                              href={`/learn/${enr.course.slug}/${firstLesson.id}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
                            >
                              <PlayCircle className="w-4 h-4" /> Continue Class
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COMPLETED LESSONS */}
          {activeTab === "lessons" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Completed Lessons History ({completedLessons.length})
                  </h2>
                  <p className="text-xs text-slate-500">Every lesson you have successfully checked off.</p>
                </div>
              </div>

              {completedLessons.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-semibold">No lessons marked completed yet.</p>
                  <p className="text-xs text-slate-500">Go to a course lesson and click &apos;Mark as Complete&apos;.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {completedLessons.map((item: any) => (
                    <div key={item.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Lesson ID: {item.lessonId}</p>
                          <p className="text-xs text-slate-500" suppressHydrationWarning>
                            Completed on: {formatDate(item.completedAt)}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                        Completed ✓
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUBMITTED TASKS & GRADES */}
          {activeTab === "submissions" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Assignment Submissions & Grades ({totalSubmissions.length})
                  </h2>
                  <p className="text-xs text-slate-500">Review your uploaded solutions, professor scores, and feedback.</p>
                </div>
              </div>

              <div className="space-y-4">
                {totalSubmissions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-slate-900 text-base">{sub.assignment.title}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        sub.status === "GRADED"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}>
                        {sub.status === "GRADED" ? `Score: ${sub.score} / ${sub.assignment.maxScore}` : "⏳ Pending Review"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{sub.assignment.description}</p>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                      <p className="font-semibold text-slate-700">
                        🔗 File Attachment: <span className="text-indigo-600 underline font-mono">{sub.fileUrl}</span>
                      </p>
                      {sub.notes && (
                        <p className="text-slate-500 italic">Student Notes: &quot;{sub.notes}&quot;</p>
                      )}
                      {sub.feedback && (
                        <p className="text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg mt-2">
                          💬 Faculty Feedback: &quot;{sub.feedback}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUIZZES TAKEN & DETAILED BREAKDOWN */}
          {activeTab === "quizzes" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" /> Assessment & Quiz Attempts ({quizAttempts.length})
                  </h2>
                  <p className="text-xs text-slate-500">Click any quiz to open questions, answers, and performance breakdown.</p>
                </div>
              </div>

              <div className="space-y-4">
                {quizAttempts.map((attempt: any) => {
                  const percent = Math.round((attempt.score / attempt.total) * 100);
                  const isPassed = percent >= 60;

                  return (
                    <div
                      key={attempt.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all bg-purple-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">
                          Attempted Assessment
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base">{attempt.quiz.title}</h3>
                        <p className="text-xs text-slate-500">{attempt.quiz.description}</p>
                        <p className="text-[11px] text-slate-400" suppressHydrationWarning>
                          Date: {formatDate(attempt.completedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900">
                            {attempt.score} <span className="text-sm text-slate-500">/ {attempt.total}</span>
                          </p>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-rose-100 text-rose-800 border-rose-300"
                          }`}>
                            {percent}% • {isPassed ? "PASSED 🎉" : "NEEDS RETAKE"}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedQuiz(attempt)}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          View Answers <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Column: Notice Board & Live Evaluations */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              📢 Notice Board
            </h3>
            <div className="space-y-3">
              {user.notifications.length === 0 ? (
                <p className="text-xs text-slate-400">No notices posted.</p>
              ) : (
                user.notifications.map((n: any) => (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2 font-mono" suppressHydrationWarning>
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Grades Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
              ⭐ Recent Evaluation
            </h3>
            {user.submissions[0] ? (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-indigo-900">{user.submissions[0].assignment.title}</p>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {user.submissions[0].score}/100
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  &quot;{user.submissions[0].feedback || "Evaluated by instructor"}&quot;
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No grades recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* QUIZ DETAILS MODAL POPUP */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Quiz Results Summary</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{selectedQuiz.quiz.title}</h3>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-around text-center">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Your Score</p>
                  <p className="text-2xl font-black text-purple-600">{selectedQuiz.score} / {selectedQuiz.total}</p>
                </div>
                <div className="h-8 border-l border-slate-200" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Percentage</p>
                  <p className="text-2xl font-black text-emerald-600">
                    {Math.round((selectedQuiz.score / selectedQuiz.total) * 100)}%
                  </p>
                </div>
                <div className="h-8 border-l border-slate-200" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Status</p>
                  <p className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mt-1">
                    PASSED ✓
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Submitted Answers</h4>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <p className="font-bold text-slate-800">1. By default, components inside Next.js App Router are:</p>
                    <p className="text-emerald-700 font-semibold">Your Answer: React Server Components (RSC) ✓ Correct</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <p className="font-bold text-slate-800">2. Which hook is used to access route search query parameters?</p>
                    <p className="text-emerald-700 font-semibold">Your Answer: useSearchParams ✓ Correct</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <p className="font-bold text-slate-800">3. True or False: Prisma can be executed directly inside client code.</p>
                    <p className="text-emerald-700 font-semibold">Your Answer: False ✓ Correct</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
