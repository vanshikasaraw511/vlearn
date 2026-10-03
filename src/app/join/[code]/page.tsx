import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, ArrowRight, BookOpen, AlertCircle } from "lucide-react";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function JoinCodePage({ params }: Props) {
  const { code } = await params;
  const session = await getCurrentUser();

  if (!session) {
    redirect(`/login?redirect=/join/${code}`);
  }

  const cleanCode = code.trim().toUpperCase();

  // Find course matching join code
  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { joinCode: cleanCode },
        { joinCode: "VL-" + cleanCode }
      ],
    },
    include: {
      instructor: true,
      modules: {
        include: { lessons: true },
      },
    },
  });

  if (!course) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Class Not Found</h2>
          <p className="text-xs text-slate-500">
            The code <strong className="font-mono text-slate-800">{code}</strong> does not correspond to an active class or has expired.
          </p>
          <div className="pt-2">
            <Link
              href="/student/dashboard"
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Return to Workspace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Auto-enroll if not already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: course.id,
      },
    },
  });

  if (!existing) {
    await prisma.enrollment.create({
      data: {
        userId: session.id,
        courseId: course.id,
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.id,
        title: "Joined " + course.title,
        message: `You enrolled via invitation link with code ${course.joinCode || cleanCode}.`,
      },
    });
  }

  const firstLesson = course.modules[0]?.lessons[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Successfully Enrolled
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">{course.title}</h2>
          <p className="text-xs text-slate-500 mt-1">Instructor: {course.instructor.name}</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
          <p className="text-slate-600 line-clamp-2">{course.description}</p>
          <p className="font-bold text-slate-800 pt-1">
            📚 {course.modules.length} Modules • Code: <span className="font-mono text-indigo-600">{course.joinCode || cleanCode}</span>
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          {firstLesson ? (
            <Link
              href={`/learn/${course.slug}/${firstLesson.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              Start Class Now <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/student/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/student/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
          >
            Go to Student Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}
