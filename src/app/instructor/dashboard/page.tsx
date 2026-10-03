"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Users, 
  Clock, 
  FileCheck2, 
  ArrowUpRight, 
  Sparkles, 
  PlusCircle,
  Copy,
  Check,
  X,
  Share2
} from "lucide-react";

function formatDate(dateInput: string | Date | undefined) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  return d.toISOString().split("T")[0];
}

export default function InstructorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [instructor, setInstructor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"courses" | "students" | "pending" | "graded">("courses");

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("BEGINNER");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDesc, setAssignmentDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdClassInfo, setCreatedClassInfo] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/instructor/dashboard");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to load");
      }
      const data = await res.json();
      setInstructor(data.instructor);
    } catch (err) {
      console.error("Error loading instructor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          assignmentTitle,
          assignmentDesc,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create class");

      setCreatedClassInfo(data.course);

      // Reload fresh database state into UI
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to create class");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-500 font-bold text-sm">Loading Instructor Studio...</p>
      </div>
    );
  }

  if (!instructor) {
    return null;
  }

  const courses = instructor.coursesTaught || [];

  // Compute roster of unique students across authored classes
  const studentMap = new Map();
  courses.forEach((c: any) => {
    (c.enrollments || []).forEach((e: any) => {
      if (e.user) {
        if (!studentMap.has(e.user.id)) {
          studentMap.set(e.user.id, {
            user: e.user,
            enrolledCourses: [c.title],
            enrolledAt: e.enrolledAt,
          });
        } else {
          studentMap.get(e.user.id).enrolledCourses.push(c.title);
        }
      }
    });
  });
  const students = Array.from(studentMap.values());

  // Aggregate all submissions
  const allSubmissions = courses.flatMap((c: any) =>
    (c.assignments || []).flatMap((a: any) =>
      (a.submissions || []).map((s: any) => ({
        ...s,
        assignmentTitle: a.title,
        maxScore: a.maxScore,
        courseTitle: c.title,
      }))
    )
  );

  const pendingSubmissions = allSubmissions.filter((s: any) => s.status === "SUBMITTED");
  const gradedSubmissions = allSubmissions.filter((s: any) => s.status === "GRADED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with "+ Create New Class" */}
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
            Create new classes, publish assignments, share student join codes, and grade submissions.
          </p>
        </div>
        
        {/* Main Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCreatedClassInfo(null);
              setTitle("");
              setDescription("");
              setAssignmentTitle("");
              setAssignmentDesc("");
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-purple-700 font-extrabold text-sm shadow-xl shadow-purple-950/20 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-purple-600" /> + Create New Class
          </button>
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
                ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-purple-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authored Classes</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{courses.length}</p>
            <span className="text-[11px] font-bold text-purple-600 mt-1 inline-flex items-center gap-1">
              {activeTab === "courses" ? "● Active View" : "View classes →"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "students"
                ? "bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-indigo-300"
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
              {activeTab === "students" ? "● Active View" : "View roster →"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "pending"
                ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-amber-300"
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
              {activeTab === "pending" ? "● Active View" : "Grade tasks →"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("graded")}
            className={`p-5 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === "graded"
                ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md scale-[1.02]"
                : "bg-white border-slate-200/90 hover:border-emerald-300"
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
              {activeTab === "graded" ? "● Active View" : "View evaluations →"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
        {activeTab === "courses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" /> Managed Classes ({courses.length})
                </h2>
                <p className="text-xs text-slate-500">Each class has a unique student join code and direct invite link.</p>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="font-semibold text-sm">You haven&apos;t created any classes yet.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Create Your First Class
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {courses.map((course: any) => {
                  const code = course.joinCode || "VL-NX742";
                  const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id || "l1";
                  const enrollCount = (course.enrollments || []).length;
                  const moduleCount = (course.modules || []).length;
                  const assignCount = (course.assignments || []).length;

                  return (
                    <div
                      key={course.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between bg-slate-50/50 space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                            {course.difficulty}
                          </span>
                          <span className="text-xs font-semibold text-slate-600">
                            👥 {enrollCount} Enrolled Students
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">{course.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                      </div>

                      {/* Class Join Code & Share Box */}
                      <div className="p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Class Join Code</span>
                          <p className="text-sm font-black font-mono text-purple-700">{code}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => copyToClipboard(code, false)}
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Copy Code"
                          >
                            <Copy className="w-3.5 h-3.5" /> Code
                          </button>
                          <button
                            onClick={() => copyToClipboard(`${window.location.origin}/join/${code}`, true)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Copy Invite Link"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Link
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          {moduleCount} Modules • {assignCount} Assignments
                        </span>
                        <Link
                          href={`/learn/${course.slug}/${firstLessonId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
                        >
                          Enter Classroom <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Active Students ({students.length})
            </h2>
            {students.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No students enrolled yet. Share your class codes!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 uppercase text-[11px] text-slate-400 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Student</th>
                      <th className="px-5 py-3.5">Email</th>
                      <th className="px-5 py-3.5">Enrolled Class</th>
                      <th className="px-5 py-3.5">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((item: any) => (
                      <tr key={item.user.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3.5 font-bold text-slate-900">{item.user.name}</td>
                        <td className="px-5 py-3.5 font-mono text-slate-500">{item.user.email}</td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">{item.enrolledCourses.join(", ")}</td>
                        <td className="px-5 py-3.5 text-slate-400">{formatDate(item.enrolledAt) || "Active"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" /> Awaiting Grading ({pendingSubmissions.length})
            </h2>
            {pendingSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No submissions waiting for evaluation.</p>
            ) : (
              pendingSubmissions.map((sub: any) => (
                <div key={sub.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{sub.assignmentTitle} - {sub.courseTitle}</h4>
                    <p className="text-xs text-slate-600">Submitted by: {sub.user?.name} ({sub.user?.email})</p>
                    <code className="text-xs text-indigo-600 underline">{sub.fileUrl}</code>
                  </div>
                  <button onClick={() => alert("Marked Graded!")} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer">
                    Score Assignment
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "graded" && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" /> Graded Tasks ({gradedSubmissions.length})
            </h2>
            {gradedSubmissions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No graded evaluations yet.</p>
            ) : (
              gradedSubmissions.map((sub: any) => (
                <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{sub.assignmentTitle} - {sub.user?.name}</h4>
                    <p className="text-xs text-emerald-700 italic">&quot;{sub.feedback}&quot;</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                    Score: {sub.score}/{sub.maxScore}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* CREATE NEW CLASS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">New Curriculum</span>
                <h3 className="text-lg font-black text-slate-900">Create a New Class 🎓</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createdClassInfo ? (
              <div className="p-6 space-y-5 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-xl">
                  🎉
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900">Class Created Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-1">Share the code or invitation link with your students:</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase">Class Join Code</span>
                    <p className="text-2xl font-black font-mono text-purple-900 mt-0.5">{createdClassInfo.joinCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(createdClassInfo.joinCode, false)}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedCode ? "Copied!" : "Copy Code"}
                    </button>
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/join/${createdClassInfo.joinCode}`, true)}
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                      {copiedLink ? "Link Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateCourse} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Class Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS301: Distributed Cloud Systems"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Briefly describe what students will master..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-black text-slate-900 mb-2">📌 Post Initial Assignment (Optional)</p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Assignment Title (e.g. Lab 1: Architecture Setup)"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Assignment Instructions & Guidelines..."
                      value={assignmentDesc}
                      onChange={(e) => setAssignmentDesc(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Generating Class..." : "Create & Generate Code ✨"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
