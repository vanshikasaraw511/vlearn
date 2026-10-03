import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  FileText,
  UserCheck,
  Calendar
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/login");
  }

  // Strict role guard: only ADMIN permitted
  if (session.role !== "ADMIN") {
    redirect("/student/dashboard");
  }

  // Fetch full system state
  const [users, courses, categories, enrollmentsCount] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.course.findMany({
      include: {
        instructor: true,
        category: true,
        enrollments: true,
        modules: { include: { lessons: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.courseCategory.findMany(),
    prisma.enrollment.count(),
  ]);

  const studentsCount = users.filter((u) => u.role === "STUDENT").length;
  const instructorsCount = users.filter((u) => u.role === "INSTRUCTOR").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Administrator Header */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">University Administration</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            System overview, credential auditing, course approvals, and platform analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> System Healthy • SQLite Connected
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Users</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{users.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{studentsCount} Students • {instructorsCount} Faculty</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Courses</span>
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{courses.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{categories.length} Categories active</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Enrollments</span>
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{enrollmentsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Across all curricula</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Categories</span>
            <Layers className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{categories.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">CS, AI, Design</p>
        </div>
      </div>

      {/* Course Directory Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Course Registry & Syllabus Status</h2>
          <span className="text-xs text-slate-400">{courses.length} courses published</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 uppercase text-[11px] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Course Name</th>
                <th className="px-5 py-3.5">Lead Instructor</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Difficulty</th>
                <th className="px-5 py-3.5">Enrollments</th>
                <th className="px-5 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white">{course.title}</td>
                  <td className="px-5 py-3.5 text-slate-300">{course.instructor.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                      {course.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 uppercase font-medium text-[11px] text-indigo-400">
                    {course.difficulty}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-200">
                    {course.enrollments.length}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/courses`}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      View Live &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Platform Users & Role Permissions</h2>
          <span className="text-xs text-slate-400">{users.length} registered accounts</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 uppercase text-[11px] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Assigned Role</th>
                <th className="px-5 py-3.5">Account Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.slice(0, 10).map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-white flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : u.role === "INSTRUCTOR"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
