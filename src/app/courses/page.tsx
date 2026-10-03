import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, Clock, BarChart3, Search, User } from "lucide-react";

interface CoursesPageProps {
  searchParams: Promise<{ q?: string; category?: string; difficulty?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { q, category, difficulty } = await searchParams;

  const whereClause: any = { isPublished: true };

  if (q) {
    whereClause.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }

  if (difficulty && difficulty !== "ALL") {
    whereClause.difficulty = difficulty;
  }

  const courses = await prisma.course.findMany({
    where: whereClause,
    include: {
      instructor: true,
      category: true,
      modules: {
        include: { lessons: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.courseCategory.findMany();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Academic Course Catalog</h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore accredited courses authored by university faculty and industry specialists.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search courses or topics..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            name="difficulty"
            defaultValue={difficulty || "ALL"}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
        >
          Apply Filters
        </button>
      </form>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800">
            <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-base font-semibold text-slate-300">No courses match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search filters</p>
          </div>
        ) : (
          courses.map((course) => {
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const firstLesson = course.modules[0]?.lessons[0];

            return (
              <div
                key={course.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group shadow-lg"
              >
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-indigo-300 border border-slate-700/60 uppercase">
                    {course.difficulty}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {course.category && (
                      <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                        {course.category.name}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {course.durationHours} hrs
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        {totalLessons} lessons
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                          {course.instructor.name.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
                          {course.instructor.name}
                        </span>
                      </div>

                      {firstLesson ? (
                        <Link
                          href={`/learn/${course.slug}/${firstLesson.id}`}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                        >
                          Start Course
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-500">Upcoming</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
