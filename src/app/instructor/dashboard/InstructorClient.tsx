"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileCheck2, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2,
  Mail,
  GraduationCap
} from "lucide-react";

function formatDate(dateInput: string | Date | undefined) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  return d.toISOString().split("T")[0];
}

export default function InstructorClient({ instructor }: { instructor: any }) {
  const [activeTab, setActiveTab] = useState<"courses" | "students" | "pending" | "graded">("courses");

  const courses = instructor.coursesTaught;
  
  // Flatten all student enrollments across instructor courses
  const studentMap = new Map();
  courses.forEach((c: any) => {
    c.enrollments.forEach((e: any) => {
      if (!studentMap.has(e.user.id)) {
        studentMap.set(e.user.id, {
          user: e.user,
          enrolledCourses: [c.title],
          enrolledAt: e.enrolledAt,
        });
      } else {
        studentMap.get(e.user.id).enrolledCourses.push(c.title);
      }
    });
  });
  const students = Array.from(studentMap.values());

  // Flatten submissions
  const allSubmissions = courses.flatMap((c: any) =>
    c.assignments.flatMap((a: any) =>
      a.submissions.map((s: any) => ({ ...s, assignmentTitle: a.title, maxScore: a.maxScore }))
    )
  );

  const pendingSubmissions = allSubmissions.filter((s: any) => s.status === "SUBMITTED");
  const gradedSubmissions = allSubmissions.filter((s: any) => s.status === "GRADED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 p-8 text-white shadow-xl shadow-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Faculty Workspace
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3">
            Instructor Studio: {instructor.name} 👋
          </h1>
          <p className="text-purple-100 text-sm mt-1 max-w-xl">
            Select any metric card below to review active students, inspect pending assignments, or manage your course curriculum.
          </p>
        </div>
        <Link
          href="/courses"
          className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-purple-700 font-extrabold text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-105"
        >
          <BookOpen className="w-4 h-4" /> Explore Catalog
        </Link>
      </div>

      {/* Interactive Tabs */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          👇 Click a card to view detailed records:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Authored Courses */}
          <button
            onClick={() => setActiveTab("courses")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "courses"
                ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-md shadow-purple-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authored Courses</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{courses.length}</p>
            <span className="text-[11px] font-bold text-purple-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "courses" ? "● Active View" : "Click to view courses →"}
            </span>
          </button>

          {/* Card 2: Active Students */}
          <button
            onClick={() => setActiveTab("students")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "students"
                ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md shadow-indigo-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Students</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{students.length}</p>
            <span className="text-[11px] font-bold text-indigo-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "students" ? "● Active View" : "Click to view roster →"}
            </span>
          </button>

          {/* Card 3: Pending Review */}
          <button
            onClick={() => setActiveTab("pending")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "pending"
                ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-md shadow-amber-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{pendingSubmissions.length}</p>
            <span className="text-[11px] font-bold text-amber-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "pending" ? "● Active View" : "Click to view pending →"}
            </span>
          </button>

          {/* Card 4: Total Graded */}
          <button
            onClick={() => setActiveTab("graded")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "graded"
                ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/10 scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Graded</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{gradedSubmissions.length}</p>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "graded" ? "● Active View" : "Click to view graded →"}
            </span>
          </button>
        </div>
      </div>

      {/* Dynamic Content Views */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
        
        {/* VIEW 1: AUTHORED COURSES */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" /> Managed Courses ({courses.length})
                </h2>
                <p className="text-xs text-slate-500">Your created curriculum, modules, and enrollment count.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.map((course: any) => {
                const totalLessons = course.modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);
                const firstLesson = course.modules[0]?.lessons[0];

                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between bg-slate-50/50"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                          {course.difficulty}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          👥 {course.enrollments.length} Enrolled Students
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base">{course.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        {course.modules.length} Modules • {totalLessons} Lessons
                      </span>
                      {firstLesson && (
                        <Link
                          href={`/learn/${course.slug}/${firstLesson.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
                        >
                          Preview Class <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE STUDENTS ROSTER */}
        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Student Enrollment Roster ({students.length})
                </h2>
                <p className="text-xs text-slate-500">Active students currently taking your courses.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 uppercase text-[11px] text-slate-400 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Course</th>
                    <th className="px-5 py-3.5">Enrolled Date</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((item: any) => (
                    <tr key={item.user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                          {item.user.name.charAt(0)}
                        </div>
                        {item.user.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{item.user.email}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">{item.enrolledCourses.join(", ")}</td>
                      <td className="px-5 py-3.5 text-slate-400" suppressHydrationWarning>
                        {formatDate(item.enrolledAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          Active Learner
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: PENDING REVIEW SUBMISSIONS */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" /> Submissions Awaiting Grading ({pendingSubmissions.length})
                </h2>
                <p className="text-xs text-slate-500">Submissions uploaded by students ready for your review.</p>
              </div>
            </div>

            {pendingSubmissions.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
                <p className="text-sm font-bold text-slate-700">All submissions are graded!</p>
                <p className="text-xs text-slate-500">No pending student solutions right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        Needs Grading
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base">{sub.assignmentTitle}</h3>
                      <p className="text-xs font-semibold text-slate-700">Student: {sub.user.name} ({sub.user.email})</p>
                      <p className="text-xs text-slate-500">
                        Attachment: <code className="text-indigo-600 underline font-mono">{sub.fileUrl}</code>
                      </p>
                      {sub.notes && (
                        <p className="text-xs text-slate-600 italic">Student Notes: &quot;{sub.notes}&quot;</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Score /100"
                        className="w-28 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        defaultValue={90}
                      />
                      <button
                        onClick={() => alert(`Marked ${sub.user.name}'s assignment as Graded!`)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Submit Grade ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: TOTAL GRADED SUBMISSIONS */}
        {activeTab === "graded" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" /> Completed Evaluations ({gradedSubmissions.length})
                </h2>
                <p className="text-xs text-slate-500">Previously scored assignments and submitted feedback.</p>
              </div>
            </div>

            <div className="space-y-4">
              {gradedSubmissions.map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500">{sub.assignmentTitle}</span>
                      <h3 className="font-extrabold text-slate-900 text-base">{sub.user.name}</h3>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300">
                      Score: {sub.score} / {sub.maxScore}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    File: <code className="text-indigo-600 font-mono">{sub.fileUrl}</code>
                  </p>

                  {sub.feedback && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-emerald-800 font-medium">
                      Feedback: &quot;{sub.feedback}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
