````markdown
# 🎓 VLearn — Interactive Learning Management System

> A full-stack, role-based Learning Management System featuring interactive classrooms, code-based enrollment, assignment management, quizzes, progress tracking, and role-based learning experiences.

---

## 🌟 Overview

**VLearn** is a full-stack Learning Management System designed to simplify online education by providing role-aware workspaces for administrators, instructors, and students.

Instructors can create and manage courses, organize learning materials, create assignments and quizzes, and monitor student progress. Students can join courses using unique class codes, access lessons, submit coursework, attempt quizzes, and track their learning progress.

VLearn uses role-based access control (RBAC) to provide different features and permissions for administrators, instructors, and students.

---

## 🚀 Key Features

### 👨‍🏫 Instructor Studio

- **Course Management**: Create and manage courses with unique Join Codes.
- **Course Organization**: Organize lessons into structured modules.
- **Lecture Content**: Add video-based lessons with descriptions and duration.
- **Coursework & Assignments**: Create assignments with descriptions and maximum scores.
- **Student Management**: View enrolled students and monitor course participation.
- **Grading & Reviews**: Review student submissions and provide scores and feedback.
- **Quiz Creation**: Create quizzes with multiple-choice questions and correct answers.
- **Progress Monitoring**: Track student learning progress through course activities.

### 🎓 Student Workspace

- **Code-Based Enrollment**: Join courses using unique course Join Codes.
- **Interactive Classroom**: Access course modules, lessons, and learning materials.
- **Video Lessons**: Watch video-based course content directly from the classroom.
- **Assignment Submission**: Submit project links and coursework for evaluation.
- **Quiz Assessments**: Attempt course quizzes and receive scores.
- **Progress Tracking**: Track completed lessons and course progress.
- **Notifications**: Receive important course and learning notifications.
- **Role-Based Dashboard**: Access features based on the student's account permissions.

### 🎯 Assessment Engine

- **Course Quizzes**: Quizzes can be associated with specific courses.
- **Question Management**: Create and manage quiz questions and answer options.
- **Automatic Evaluation**: Quiz attempts are evaluated based on the configured correct answers.
- **Score Tracking**: Store quiz scores and total marks for each attempt.
- **Attempt History**: Maintain records of student quiz attempts.
- **Assignment Evaluation**: Store submission scores, feedback, and grading status.

---

## 🔐 Authentication & Authorization

VLearn uses secure cookie-based JWT authentication with **Role-Based Access Control (RBAC)**.

The system supports three primary roles:

- **ADMIN** — Platform administration and management.
- **INSTRUCTOR** — Course, lesson, assignment, and quiz management.
- **STUDENT** — Course enrollment, learning activities, submissions, and assessments.

---

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js 16 with App Router, Server Actions, and API Routes
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Cookie-based JWT
- **Authorization**: Role-Based Access Control (RBAC)
- **Password Security**: bcryptjs
- **Charts & Analytics**: Recharts

---

## 📁 Project Structure

```text
vlearn/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   └── ...
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
````

---

## ⚡ Quickstart

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/vanshikasaraw511/vlearn.git
cd vlearn
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-postgresql-database-url"
JWT_SECRET="your-secure-jwt-secret"
NODE_ENV="development"
```

> Replace `your-postgresql-database-url` with your PostgreSQL database connection string.

> Do not commit your `.env` file or expose database credentials and secret keys publicly.

### 3. Database Setup & Seed

Generate the Prisma client, create/update the database schema, and populate the database with demo data:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

The seed script creates demo users, a sample course, modules, lessons, assignments, quizzes, enrollments, progress records, submissions, quiz attempts, and notifications.

### 4. Run Development Server

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## 🔐 Default Demo Accounts

| Role       | Email                 | Password      |
| ---------- | --------------------- | ------------- |
| Admin      | `admin@vlearn.edu`    | `password123` |
| Instructor | `sarah@vlearn.edu`    | `password123` |
| Student    | `student1@vlearn.edu` | `password123` |

Additional demo student accounts are also created:

```text
student2@vlearn.edu
student3@vlearn.edu
...
student10@vlearn.edu
```

All demo student accounts use:

```text
Password: password123
```

---

## 🌱 Demo Course

The seed data includes a sample course:

**Advanced Full-Stack Engineering with Next.js**

The course includes:

* Architecture & Server Components
* Data Access with Prisma ORM
* Authentication & RBAC
* Video-based lessons
* Assignment
* Quiz
* Student enrollment
* Progress tracking
* Submission and grading data
* Notifications

---

## 🚀 Production Deployment

VLearn can be deployed on platforms that support Next.js and PostgreSQL, such as Render.

For production deployment:

1. Configure the `DATABASE_URL` environment variable with your PostgreSQL database URL.
2. Configure a secure `JWT_SECRET`.
3. Install dependencies.
4. Generate the Prisma client.
5. Synchronize the production database schema.
6. Build the Next.js application.
7. Start the production server.

Example commands:

```bash
npm install
npx prisma db push
npm run build
npm start
```

> For production environments, keep database credentials and authentication secrets in the hosting platform's environment variables rather than committing them to GitHub.

---

## ⚠️ Important Database Note

The `prisma/seed.ts` script resets existing database records before inserting demo data.

Therefore, **do not run the seed script on a production database containing real user data**, unless you intentionally want to reset that database.

For local development, the seed script can be used to restore the demo environment:

```bash
npx prisma db seed
```

---

## 📄 License

This project is open-source and available under the MIT License.

```
```
