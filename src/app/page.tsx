import Link from "next/link";
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Sparkles
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" /> Next-Generation Learning Experience 🌟
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Learn Faster, Build Better with{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              VLearn LMS 🎓
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Interactive video classrooms, automated quizzes, real code assignments, and live grading for modern students and educators.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all hover:scale-105"
            >
              <span>🚀 Launch Demo App</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-base shadow-sm hover:shadow transition-all"
            >
              <span>📚 Explore Courses</span>
            </Link>
          </div>

          {/* Quick Platform Stats */}
          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
            <div className="p-3 text-center">
              <p className="text-2xl sm:text-3xl font-black text-indigo-600">14+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">👥 Active Users</p>
            </div>
            <div className="p-3 text-center border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-black text-purple-600">100%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">⚡ Interactive Video</p>
            </div>
            <div className="p-3 text-center border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-black text-pink-600">3 Roles</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">🛡️ Student, Teacher, Admin</p>
            </div>
            <div className="p-3 text-center border-l border-slate-100">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">Instant</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">🎯 Automated Quizzes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">🔥 Trending Curriculum</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Popular Courses on VLearn</h2>
          </div>
          <Link href="/courses" className="mt-2 sm:mt-0 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            See all courses &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
            <div className="h-48 relative overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"
                alt="Full Stack Next.js"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-indigo-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                💻 Full-Stack
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900">Advanced Full-Stack with Next.js & Prisma</h3>
                <p className="text-xs text-slate-500 mt-2">Server Components, Server Actions, SQLite database integration, and role guards.</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">⏱️ 32.5 Hours</span>
                <Link href="/login" className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold transition-all">
                  Start Now 🚀
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
            <div className="h-48 relative overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800"
                alt="Machine Learning"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-purple-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                🤖 AI & ML
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900">Machine Learning & Neural Foundations</h3>
                <p className="text-xs text-slate-500 mt-2">Gradient descent, multi-variable calculus, tensor calculations, and model fine-tuning.</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">⏱️ 45 Hours</span>
                <Link href="/login" className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold transition-all">
                  Start Now 🚀
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
            <div className="h-48 relative overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800"
                alt="Design Systems"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-pink-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                🎨 UI / UX
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-lg text-slate-900">Design Systems & Human-Centered UX</h3>
                <p className="text-xs text-slate-500 mt-2">Visual hierarchy, accessibility audits (WCAG), tokenization, and design systems.</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">⏱️ 22 Hours</span>
                <Link href="/login" className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-700 text-xs font-bold transition-all">
                  Start Now 🚀
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
