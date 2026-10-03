"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  PlayCircle, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  FileText,
  Clock,
  Sparkles
} from "lucide-react";

export default function LessonView({
  course,
  activeLesson,
  allLessons,
  prevLesson,
  nextLesson,
  userId,
}: any) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(
    activeLesson.progress?.some((p: any) => p.userId === userId && p.completed) || false
  );
  const [loading, setLoading] = useState(false);

  const toggleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: activeLesson.id }),
      });
      const data = await res.json();
      setIsCompleted(data.completed);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = allLessons.filter((l: any) =>
    l.progress?.some((p: any) => p.completed)
  ).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-950">
      {/* Left/Main Column: Media Player & Content */}
      <div className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs font-medium text-slate-400">
            Course Progress: <strong className="text-indigo-400">{progressPercent}%</strong>
          </span>
        </div>

        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <video
            key={activeLesson.videoUrl}
            controls
            className="w-full h-full object-contain"
            poster={course.thumbnail}
          >
            <source src={activeLesson.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>

        {/* Lesson Details & Actions Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {course.title}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {activeLesson.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {activeLesson.durationMin} mins
                </span>
                <span>•</span>
                <span>Instructor: {course.instructor.name}</span>
              </div>
            </div>

            <button
              onClick={toggleComplete}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCompleted ? "Completed ✓" : "Mark as Complete"}
            </button>
          </div>

          {/* Lesson Overview Content */}
          <div className="mt-5 text-sm text-slate-300 leading-relaxed space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lesson Notes</h3>
            <p>{activeLesson.content || "Follow along with the lecture video above and work through the concepts."}</p>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-between">
            {prevLesson ? (
              <Link
                href={`/learn/${course.slug}/${prevLesson.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Lesson
              </Link>
            ) : <div />}

            {nextLesson ? (
              <Link
                href={`/learn/${course.slug}/${nextLesson.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Next Lesson <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/student/dashboard"
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Finish Course 🎉
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Syllabus Navigation Sidebar */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 p-6 space-y-5">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Course Syllabus</h2>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {completedCount} of {allLessons.length} lessons completed ({progressPercent}%)
          </p>
        </div>

        <div className="space-y-4">
          {course.modules.map((mod: any) => (
            <div key={mod.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/90">
              <div className="px-4 py-3 bg-slate-800/60 font-semibold text-xs text-slate-200 border-b border-slate-800">
                {mod.title}
              </div>
              <div className="divide-y divide-slate-800/60">
                {mod.lessons.map((lesson: any) => {
                  const isActive = lesson.id === activeLesson.id;
                  const isLessonDone = lesson.progress?.some((p: any) => p.completed);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${course.slug}/${lesson.id}`}
                      className={`flex items-center justify-between px-4 py-3 text-xs transition-colors ${
                        isActive
                          ? "bg-indigo-600/10 text-indigo-400 font-semibold border-l-2 border-indigo-500"
                          : "text-slate-300 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        {isLessonDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 shrink-0">{lesson.durationMin}m</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
