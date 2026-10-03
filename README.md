# 🎓 VLearn — Interactive Learning Management System

> A full-stack, role-based Learning Management System featuring interactive classrooms, code-based enrollment, real-time collaboration, and timed quiz assessments with live leaderboards.

---

## 🌟 Overview

**VLearn** is designed to simplify online education by providing persistent, role-aware workspaces for teachers and learners. Instructors can organize classes, upload lecture materials, launch virtual meetings, and build timed assessments. Students can join via class codes, interact through live group chat, submit assignments to earn credit points, and review in-depth quiz analytics.

---

## 🚀 Key Features

### 👨‍🏫 Instructor Studio

* **Course & Roster Management**: Create classes and generate unique Join Codes (`VL-XXXXX`) or direct invite links.
* **Lecture Hosting**: Upload video sessions, attach reference PDFs/notes, and set lesson durations.
* **Coursework & Rubrics**: Post assignments with custom Credit Points (CP), guidelines, and reference files.
* **Co-Teacher Collaboration**: Add fellow instructors with full classroom management permissions.
* **Grading & Reviews**: Track student enrollments, inspect submission URLs, and assign scores.

### 🎓 Student Workspace

* **Code-Based Enrollment**: Join active classes instantly using a 6-character code or invitation link.
* **Interactive Classroom**: Watch uploaded lectures, read notes, and download study attachments.
* **Coursework Submission**: Turn in project URLs or solution files to claim credit points.
* **Real-Time Group Chat**: Persistent classroom discussion channel for collaborative questions.
* **Instant Virtual Meetings**: Join live video sessions with presenter streams and mic/camera controls.

### 🎯 Assessment Engine (Public & Private)

* **Public Campus Quizzes**: Open skill assessments accessible directly from the student workspace catalog.
* **Private Classroom Quizzes**: Graded evaluations restricted strictly to enrolled course members.
* **Quiz Builder Wizard**:
* Set total questions, total marks, time limit, and deadlines.
* Question formats: Single Choice, Multiple Choice (checkmarks), or One-Word answers.
* Compulsory question flags and point weights.
* Audience targeting: Publish to all enrolled students or selected learners.


* **Detailed Analytics & Audit**:
* **My Responses**: Question-by-question review with answer comparisons and solution rationales.
* **Leaderboard**: Real-time ranks sorted by score and completion speed.
* **Performance Metrics**: Attendance tracking, speed per question, and percentile standings.



---

## 🛠️ Tech Stack

* **Frontend & Backend**: Next.js (App Router, Server Actions, API Routes)
* **Language**: TypeScript
* **Database & ORM**: SQLite + Prisma ORM
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Authentication**: Cookie-based JWT with Role-Based Access Control (RBAC)

---

## ⚡ Quickstart

### 1. Installation

```bash
git clone https://github.com/<YOUR_USERNAME>/vlearn.git
cd vlearn
npm install

```

### 2. Environment Setup

Create a `.env` file in the root folder:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="vlearn-super-secure-jwt-secret-key-32chars"
NODE_ENV="development"

```

### 3. Database Migration & Seed

```bash
npx prisma db push
npx tsx prisma/seed.ts

```

### 4. Run Development Server

```bash
npm run dev

```

Visit `http://localhost:3000` in your browser.

---

## 🔐 Default Demo Accounts

* **Teacher**: `sarah@vlearn.edu` / `password123`
* **Student**: `student1@vlearn.edu` / `password123`

---

## 📄 License

This project is open-source and available under the MIT License.
