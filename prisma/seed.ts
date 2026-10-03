import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Resetting and seeding database...");

  // Delete records safely
  try { await prisma.notification.deleteMany(); } catch {}
  try { await prisma.progress.deleteMany(); } catch {}
  try { await prisma.quizAttempt.deleteMany(); } catch {}
  try { await prisma.question.deleteMany(); } catch {}
  try { await prisma.quiz.deleteMany(); } catch {}
  try { await prisma.submission.deleteMany(); } catch {}
  try { await prisma.assignment.deleteMany(); } catch {}
  try { await prisma.lesson.deleteMany(); } catch {}
  try { await prisma.module.deleteMany(); } catch {}
  try { await prisma.enrollment.deleteMany(); } catch {}
  try { await prisma.course.deleteMany(); } catch {}
  try { await prisma.courseCategory.deleteMany(); } catch {}
  try { await prisma.user.deleteMany(); } catch {}

  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Categories
  const csCat = await prisma.courseCategory.create({
    data: {
      name: "Computer Science",
      slug: "computer-science",
      description: "Full stack engineering, systems, and algorithms.",
    },
  });

  // 2. Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@vlearn.edu",
      name: "System Administrator",
      role: "ADMIN",
      passwordHash,
      avatar: "🛡️",
      bio: "Platform administrator.",
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: "sarah@vlearn.edu",
      name: "Prof. Sarah Jenkins",
      role: "INSTRUCTOR",
      passwordHash,
      avatar: "👨‍🏫",
      bio: "Lead Professor of Software Engineering.",
    },
  });

  const student = await prisma.user.create({
    data: {
      email: "student1@vlearn.edu",
      name: "Emily Watson",
      role: "STUDENT",
      passwordHash,
      avatar: "🎓",
      bio: "CS major interested in distributed cloud architectures.",
    },
  });

  for (let i = 2; i <= 10; i++) {
    await prisma.user.create({
      data: {
        email: `student${i}@vlearn.edu`,
        name: `Student Learner ${i}`,
        role: "STUDENT",
        passwordHash,
        avatar: "🎓",
      },
    });
  }

  // 3. Course with Join Code
  const course = await prisma.course.create({
    data: {
      title: "Advanced Full-Stack Engineering with Next.js",
      slug: "fullstack-nextjs",
      description: "Master modern web engineering: Server Components, Server Actions, Prisma ORM, and high-performance state management.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
      difficulty: "ADVANCED",
      durationHours: 32.5,
      joinCode: "VL-NX742",
      instructorId: instructor.id,
      categoryId: csCat.id,
      modules: {
        create: [
          {
            title: "Module 1: Architecture & Server Components",
            order: 1,
            lessons: {
              create: [
                {
                  title: "1.1 App Router Fundamentals",
                  content: "Understand Server Components, Client Components, and server streaming.",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  durationMin: 18,
                  order: 1,
                },
                {
                  title: "1.2 Data Access with Prisma ORM",
                  content: "Set up schema definitions, migrations, and SQLite relational modeling.",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  durationMin: 22,
                  order: 2,
                },
              ],
            },
          },
          {
            title: "Module 2: Authentication & RBAC",
            order: 2,
            lessons: {
              create: [
                {
                  title: "2.1 JWT Session Management",
                  content: "Implement HTTP-only cookies and role-based route middleware protection.",
                  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                  durationMin: 25,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
      assignments: {
        create: [
          {
            title: "Project 1: Secure Auth Microservice",
            description: "Build an RBAC authentication microservice using JWT cookies with unit test coverage.",
            maxScore: 100,
          },
        ],
      },
      quizzes: {
        create: [
          {
            title: "Next.js Core Concepts Assessment",
            description: "Test your understanding of RSC boundaries, server caching, and layout routing.",
            questions: {
              create: [
                {
                  prompt: "By default, components inside Next.js App Router are:",
                  optionsJson: JSON.stringify(["Client Components", "React Server Components (RSC)", "Pure HTML", "Static Assets"]),
                  correctAnswer: "React Server Components (RSC)",
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      modules: { include: { lessons: true } },
      assignments: true,
      quizzes: true,
    },
  });

  // Enroll Emily in this course
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
    },
  });

  // Enroll other students
  const otherStudents = await prisma.user.findMany({ where: { role: "STUDENT" } });
  for (const s of otherStudents) {
    if (s.id !== student.id) {
      await prisma.enrollment.create({
        data: {
          userId: s.id,
          courseId: course.id,
        },
      });
    }
  }

  // Seed progress & submission for Emily
  const firstLesson = course.modules[0].lessons[0];
  await prisma.progress.create({
    data: {
      userId: student.id,
      lessonId: firstLesson.id,
      completed: true,
    },
  });

  await prisma.submission.create({
    data: {
      assignmentId: course.assignments[0].id,
      userId: student.id,
      fileUrl: "https://github.com/student/secure-auth-service",
      notes: "Implemented token rotation, role guards, and middleware.",
      score: 95,
      feedback: "Excellent architecture, clean error boundaries and clear test coverage!",
      status: "GRADED",
    },
  });

  await prisma.quizAttempt.create({
    data: {
      quizId: course.quizzes[0].id,
      userId: student.id,
      score: 1,
      total: 1,
    },
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      title: "Welcome to VLearn!",
      message: "You have been enrolled in Advanced Full-Stack Engineering with Next.js. Begin Module 1 today.",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
