"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  GraduationCap, 
  Compass, 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X,
  Edit3
} from "lucide-react";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  avatar?: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "INSTRUCTOR") return "/instructor/dashboard";
    return "/student/dashboard";
  };

  const getRoleBadge = (role: string) => {
    if (role === "ADMIN") return { label: "🛡️️ Admin", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    if (role === "INSTRUCTOR") return { label: "👨‍🏫 Teacher", color: "bg-purple-100 text-purple-800 border-purple-300" };
    return { label: "🎓 Student", color: "bg-blue-100 text-blue-800 border-blue-300" };
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
              VLearn <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold border border-indigo-200">PRO</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2 text-sm font-semibold text-slate-600">
          <Link 
            href="/courses" 
            className="px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-indigo-500" />
            Explore Courses
          </Link>
          {user && (
            <Link 
              href={getDashboardLink()} 
              className="px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-500" />
              My Workspace
            </Link>
          )}
        </nav>

        {/* User Account / Auth Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 relative transition-colors border border-transparent hover:border-indigo-100 cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-xs z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        🔔 Notifications <span className="bg-pink-100 text-pink-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">2 new</span>
                      </p>
                    </div>
                    <div className="space-y-2 mt-3">
                      <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-slate-700">
                        <p className="font-semibold text-indigo-900">🎉 Welcome to VLearn!</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Explore your interactive courses and take quizzes.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-slate-700">
                        <p className="font-semibold text-emerald-900">✅ New Module Live</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Full-Stack Next.js Module 2 is ready.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Clickable Profile Pill -> Leads to /profile */}
              <Link
                href="/profile"
                className="group flex items-center space-x-2.5 bg-slate-100 hover:bg-indigo-50/80 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-300 transition-all shadow-xs"
                title="Click to Edit Profile"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {user.avatar ? user.avatar : user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight flex items-center gap-1">
                    {user.name} <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 opacity-70 group-hover:opacity-100" />
                  </p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${getRoleBadge(user.role).color}`}>
                    {getRoleBadge(user.role).label}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                href="/login"
                className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-105"
              >
                Sign In 🔑
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-semibold text-slate-700 py-2 hover:text-indigo-600"
          >
            📚 Browse Courses
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-slate-800 py-2 hover:text-indigo-600"
              >
                ✏️ Edit Profile ({user.name})
              </Link>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-indigo-600 py-2"
              >
                🚀 My Workspace ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left font-semibold text-rose-600 py-2"
              >
                🚪 Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl"
              >
                Sign In 🔑
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
