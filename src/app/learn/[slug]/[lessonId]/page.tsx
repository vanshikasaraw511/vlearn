"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  Play, 
  CheckCircle2, 
  Video, 
  MessageSquare, 
  FilePlus, 
  Award, 
  Send, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  X, 
  ArrowLeft, 
  Paperclip, 
  Coins, 
  Upload, 
  Folder, 
  Plus, 
  Users, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Trophy, 
  Flame, 
  Check, 
  ExternalLink 
} from "lucide-react";

interface QuestionConfig {
  id: number;
  prompt: string;
  isCompulsory: boolean;
  marks: number;
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "ONE_WORD";
  options: string[];
  correctAnswer: string | string[];
}

interface QuizItem {
  id: string;
  title: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  deadline: string;
  targetAudience: "ALL" | "SELECTED";
  selectedStudentIds?: string[];
  questions: QuestionConfig[];
  submissions: Array<{
    studentId: string;
    studentName: string;
    studentAvatar: string;
    score: number;
    timeTakenSeconds: number;
    submittedAt: string;
  }>;
}

export default function LearnLessonPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params?.slug as string;
  const lessonId = params?.lessonId as string;

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Classroom Modals
  const [showMeeting, setShowMeeting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Persistent Live Chat
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isTeacher: boolean }>>([]);
  const [chatInput, setChatInput] = useState("");

  // Persistent Lectures
  const [lectures, setLectures] = useState<any[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<any | null>(null);

  // Upload Lecture Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lecTitle, setLecTitle] = useState("");
  const [lecDesc, setLecDesc] = useState("");
  const [lecVideoUrl, setLecVideoUrl] = useState("");
  const [lecAttachment, setLecAttachment] = useState("");
  const [lecDuration, setLecDuration] = useState<number>(20);

  // Assignments
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [newAssignTitle, setNewAssignTitle] = useState("");
  const [newAssignDesc, setNewAssignDesc] = useState("");
  const [newAssignCredits, setNewAssignCredits] = useState<number>(3);
  const [newAssignAttachment, setNewAssignAttachment] = useState("");

  // Participants
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [teachersList, setTeachersList] = useState<any[]>([
    { id: "t1", name: "Prof. Sarah Jenkins", email: "sarah@vlearn.edu", role: "INSTRUCTOR", joinedAt: "Course Creator" }
  ]);
  const [studentsList, setStudentsList] = useState<any[]>([
    { id: "s1", name: "Emily Watson", email: "student1@vlearn.edu", role: "STUDENT" },
    { id: "s2", name: "Liam Miller", email: "student2@vlearn.edu", role: "STUDENT" },
    { id: "s3", name: "Riya", email: "riya@vlearn.edu", role: "STUDENT" }
  ]);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");

  // Persistent Quizzes
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);

  // Quiz Builder
  const [quizStep, setQuizStep] = useState<"CONFIG" | "QUESTIONS" | "AUDIENCE">("CONFIG");
  const [qTitle, setQTitle] = useState("");
  const [qCount, setQCount] = useState<number>(2);
  const [qMarks, setQMarks] = useState<number>(10);
  const [qDuration, setQDuration] = useState<number>(15);
  const [qDeadline, setQDeadline] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState<QuestionConfig[]>([]);
  const [targetAudience, setTargetAudience] = useState<"ALL" | "SELECTED">("ALL");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Current Question
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currPrompt, setCurrPrompt] = useState("");
  const [currCompulsory, setCurrCompulsory] = useState(true);
  const [currMarks, setCurrMarks] = useState(5);
  const [currType, setCurrType] = useState<"SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "ONE_WORD">("SINGLE_CHOICE");
  const [currOptions, setCurrOptions] = useState<string[]>(["Option A", "Option B", "Option C", "Option D"]);
  const [currAnswer, setCurrAnswer] = useState<string>("Option A");

  // Teacher Results Modal
  const [viewingQuizResults, setViewingQuizResults] = useState<QuizItem | null>(null);

  // Student Attempt State
  const [activeQuizToTake, setActiveQuizToTake] = useState<QuizItem | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, any>>({});
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<any | null>(null);

  // Load backend state
  const loadClassroomData = async () => {
    try {
      const [quizRes, chatRes, lecRes] = await Promise.all([
        fetch(`/api/quizzes?slug=${slug}`),
        fetch(`/api/classroom/chat?slug=${slug}`),
        fetch(`/api/lectures?slug=${slug}`)
      ]);

      if (quizRes.ok) {
        const qData = await quizRes.json();
        setQuizzes(qData.quizzes || []);
      }

      if (chatRes.ok) {
        const cData = await chatRes.json();
        setMessages(cData.messages || []);
      }

      if (lecRes.ok) {
        const lData = await lecRes.json();
        const loadedLecs = lData.lectures || [];
        setLectures(loadedLecs);
        if (loadedLecs.length > 0 && !selectedLecture) {
          setSelectedLecture(loadedLecs[0]);
        }
      }
    } catch (err) {
      console.error("Error loading classroom data:", err);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push(`/login?redirect=/learn/${slug}/${lessonId}`);
        } else {
          setCurrentUser(data.user);
          loadClassroomData();
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [slug, lessonId, router]);

  // Periodic poll for incoming chat messages & quizzes
  useEffect(() => {
    const timer = setInterval(() => {
      if (slug) {
        fetch(`/api/classroom/chat?slug=${slug}`)
          .then((r) => r.json())
          .then((d) => d.messages && setMessages(d.messages))
          .catch(() => {});
        fetch(`/api/quizzes?slug=${slug}`)
          .then((r) => r.json())
          .then((d) => d.quizzes && setQuizzes(d.quizzes))
          .catch(() => {});
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [slug]);

  // Student Timer
  useEffect(() => {
    let interval: any = null;
    if (activeQuizToTake && quizTimer > 0 && !quizSubmittedResult) {
      interval = setInterval(() => {
        setQuizTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            handleStudentSubmitQuiz();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuizToTake, quizTimer, quizSubmittedResult]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-slate-500 font-bold text-sm">Loading classroom session...</p>
      </div>
    );
  }

  const isTeacher =
    currentUser.role === "INSTRUCTOR" ||
    currentUser.role === "ADMIN" ||
    teachersList.some((t) => t.email.toLowerCase() === currentUser.email.toLowerCase());

  const activeQuizzesForStudent = quizzes.filter((q) => {
    if (q.targetAudience === "ALL") return true;
    return (
      q.selectedStudentIds?.includes(currentUser.id) ||
      q.selectedStudentIds?.includes(currentUser.name)
    );
  });

  const totalCourseCredits =
    assignments.reduce((acc, a) => acc + (Number(a.creditPoints) || 0), 0) +
    quizzes.reduce((acc, q) => acc + (Number(q.totalMarks) || 0), 0);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins}m ${rem}s`;
  };

  // SEND CHAT MESSAGE (PERSISTENT)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const textToSend = chatInput.trim();
    setChatInput("");

    try {
      const res = await fetch("/api/classroom/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, text: textToSend }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // UPLOAD LECTURE (PERSISTENT)
  const handleUploadLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecTitle.trim()) return;

    try {
      const res = await fetch("/api/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: lecTitle.trim(),
          description: lecDesc.trim(),
          videoUrl: lecVideoUrl.trim() || undefined,
          attachmentUrl: lecAttachment.trim() || undefined,
          durationMin: Number(lecDuration) || 15,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = [...lectures, data.lecture];
        setLectures(updated);
        setSelectedLecture(data.lecture);
        setLecTitle("");
        setLecDesc("");
        setLecVideoUrl("");
        setLecAttachment("");
        setShowUploadModal(false);
        alert("Lecture uploaded and saved permanently! 🚀");
      }
    } catch (err) {
      alert("Failed to upload lecture");
    }
  };

  // ADD CO-TEACHER
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) return;

    const added = {
      id: Date.now().toString(),
      name: newTeacherName.trim(),
      email: newTeacherEmail.trim().toLowerCase(),
      role: "INSTRUCTOR",
      joinedAt: "Added by Instructor",
    };

    setTeachersList([...teachersList, added]);
    setNewTeacherName("");
    setNewTeacherEmail("");
    alert(`Success: ${added.name} is now a co-teacher! 👨‍🏫`);
  };

  // QUIZ WIZARD 1
  const handleStartQuestionEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTitle.trim() || qCount <= 0) return;
    setCurrentQuestions([]);
    setCurrentQIndex(0);
    setCurrPrompt("");
    setCurrCompulsory(true);
    setCurrMarks(Math.round(qMarks / qCount) || 5);
    setCurrType("SINGLE_CHOICE");
    setCurrOptions(["Option A", "Option B", "Option C", "Option D"]);
    setCurrAnswer("Option A");
    setQuizStep("QUESTIONS");
  };

  // QUIZ WIZARD 2
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPrompt.trim()) return;

    const newQuestion: QuestionConfig = {
      id: currentQIndex + 1,
      prompt: currPrompt.trim(),
      isCompulsory: currCompulsory,
      marks: Number(currMarks) || 1,
      type: currType,
      options: currType === "ONE_WORD" ? [] : currOptions,
      correctAnswer: currAnswer,
    };

    const updated = [...currentQuestions, newQuestion];
    setCurrentQuestions(updated);

    if (currentQIndex + 1 < qCount) {
      setCurrentQIndex(currentQIndex + 1);
      setCurrPrompt("");
      setCurrCompulsory(true);
      setCurrMarks(Math.round(qMarks / qCount) || 5);
      setCurrType("SINGLE_CHOICE");
      setCurrOptions(["Option A", "Option B", "Option C", "Option D"]);
      setCurrAnswer("Option A");
    } else {
      setQuizStep("AUDIENCE");
    }
  };

  // QUIZ WIZARD 3: PUBLISH TO DATABASE (PERSISTENT)
  const handlePublishQuiz = async () => {
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: qTitle.trim(),
          totalQuestions: qCount,
          totalMarks: qMarks,
          durationMinutes: qDuration,
          deadline: qDeadline || "2026-10-15 23:59",
          targetAudience,
          selectedStudentIds: targetAudience === "SELECTED" ? selectedStudents : undefined,
          questions: currentQuestions,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save quiz");
      }

      await loadClassroomData();
      setShowQuizModal(false);
      setQuizStep("CONFIG");
      alert(`🎉 Quiz "${qTitle}" saved to database and published!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // STUDENT ATTEMPT
  const handleStartQuizAttempt = (quiz: QuizItem) => {
    setActiveQuizToTake(quiz);
    setStudentAnswers({});
    setQuizTimer(quiz.durationMinutes * 60);
    setQuizSubmittedResult(null);
  };

  // STUDENT SUBMIT (PERSISTENT)
  const handleStudentSubmitQuiz = async () => {
    if (!activeQuizToTake) return;

    let score = 0;
    activeQuizToTake.questions.forEach((q) => {
      const ans = studentAnswers[q.id];
      if (!ans) return;

      if (q.type === "ONE_WORD") {
        if (typeof ans === "string" && ans.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
          score += q.marks;
        }
      } else if (ans === q.correctAnswer) {
        score += q.marks;
      }
    });

    const timeSpent = activeQuizToTake.durationMinutes * 60 - quizTimer;

    try {
      await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_ATTEMPT",
          slug,
          quizId: activeQuizToTake.id,
          score,
          timeTakenSeconds: timeSpent,
        }),
      });
      await loadClassroomData();
    } catch (e) {
      console.error(e);
    }

    setQuizSubmittedResult({
      score,
      total: activeQuizToTake.totalMarks,
      timeTaken: timeSpent,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Classroom Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={isTeacher ? "/instructor/dashboard" : "/student/dashboard"}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Course Classroom
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-600" /> Total Credits: {totalCourseCredits} CP
              </span>
            </div>
            <h1 className="text-base font-black text-slate-900 line-clamp-1 mt-0.5">Live Learning Session</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {isTeacher && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" /> + Upload Lecture
            </button>
          )}

          {isTeacher && (
            <button
              onClick={() => setShowAssignmentModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors cursor-pointer border border-blue-200"
            >
              <FilePlus className="w-4 h-4 text-blue-600" /> + Add Assignment
            </button>
          )}

          {isTeacher ? (
            <button
              onClick={() => {
                setQuizStep("CONFIG");
                setShowQuizModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" /> + Create Quiz
            </button>
          ) : (
            <button
              onClick={() => {
                if (activeQuizzesForStudent.length > 0) {
                  handleStartQuizAttempt(activeQuizzesForStudent[0]);
                } else {
                  alert("No active quizzes available in this class yet.");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200 transition-colors cursor-pointer relative"
            >
              <Award className="w-4 h-4 text-purple-600" />
              Active Quizzes ({activeQuizzesForStudent.length})
              {activeQuizzesForStudent.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute -top-1 -right-1" />
              )}
            </button>
          )}

          {isTeacher && (
            <button
              onClick={() => setShowMeeting(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 cursor-pointer"
            >
              <Video className="w-4 h-4 animate-pulse" /> Start Instant Meeting 🔴
            </button>
          )}

          <button
            onClick={() => setShowParticipantsModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-300"
          >
            <Users className="w-4 h-4 text-indigo-600" /> See Participants ({teachersList.length + studentsList.length})
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-300"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Classroom Chat
            <span className="bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {messages.length}
            </span>
          </button>
        </div>
      </div>

      {/* STUDENT ACTIVE QUIZ NOTIFICATION BANNER */}
      {!isTeacher && activeQuizzesForStudent.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
                🔔
              </div>
              <div>
                <p className="font-black text-sm">Active Quiz Available: {activeQuizzesForStudent[0].title}</p>
                <p className="text-xs text-purple-100">
                  {activeQuizzesForStudent[0].totalQuestions} Questions • {activeQuizzesForStudent[0].totalMarks} Marks • Duration: {activeQuizzesForStudent[0].durationMinutes} mins • Deadline: {activeQuizzesForStudent[0].deadline}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleStartQuizAttempt(activeQuizzesForStudent[0])}
              className="px-5 py-2.5 rounded-xl bg-white text-purple-700 text-xs font-black shadow-md hover:bg-slate-50 transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              Attempt Quiz Now 🚀
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {selectedLecture ? (
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md aspect-video relative flex items-center justify-center">
                {selectedLecture.videoUrl ? (
                  <video controls className="w-full h-full object-cover" src={selectedLecture.videoUrl} />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Folder className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                    <p className="font-bold text-white text-base">{selectedLecture.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{selectedLecture.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    ⏱️ {selectedLecture.durationMin} Minutes
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">{selectedLecture.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedLecture.description}</p>
                </div>
                {selectedLecture.attachmentUrl && (
                  <a
                    href={selectedLecture.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Attachment <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Folder className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900">No Lectures Uploaded Yet</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isTeacher
                  ? "Start by uploading video lectures, study materials, or presentations for your enrolled students."
                  : "Your instructor has not uploaded any lectures yet. Check back soon or participate in quizzes."}
              </p>
              {isTeacher && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload First Lecture
                </button>
              )}
            </div>
          )}

          {/* TEACHER QUIZZES MANAGEMENT */}
          {isTeacher && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" /> Classroom Quizzes ({quizzes.length})
                  </h3>
                  <p className="text-xs text-slate-500">Track student submissions, leaderboards, and completion times.</p>
                </div>
                <button
                  onClick={() => {
                    setQuizStep("CONFIG");
                    setShowQuizModal(true);
                  }}
                  className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Quiz
                </button>
              </div>

              {quizzes.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No quizzes created for this class yet.</p>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((q) => (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                            {q.targetAudience === "ALL" ? "All Students" : "Selected Roster"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">Deadline: {q.deadline}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-1">{q.title}</h4>
                        <p className="text-xs text-slate-500">
                          {q.totalQuestions} Questions • {q.totalMarks} Marks • ⏱️ {q.durationMinutes} mins • {q.submissions.length} Submissions
                        </p>
                      </div>

                      <button
                        onClick={() => setViewingQuizResults(q)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                      >
                        <Trophy className="w-4 h-4 text-amber-500" /> See Results & Leaderboard →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Playlist */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Class Lectures ({lectures.length})
              </h3>
              {isTeacher && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Upload
                </button>
              )}
            </div>

            {lectures.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Playlist is currently empty.</p>
            ) : (
              <div className="space-y-2">
                {lectures.map((lec) => (
                  <button
                    key={lec.id}
                    onClick={() => setSelectedLecture(lec)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedLecture?.id === lec.id
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 shrink-0" /> {lec.title}
                      </span>
                      <span className="text-[10px] opacity-75">{lec.durationMin}m</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE QUIZ MODAL (TEACHER) */}
      {showQuizModal && isTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                  Step {quizStep === "CONFIG" ? "1/3: Overview" : quizStep === "QUESTIONS" ? `2/3: Question ${currentQIndex + 1} of ${qCount}` : "3/3: Target Audience"}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">Create Class Quiz 🎯</h3>
              </div>
              <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {quizStep === "CONFIG" && (
              <form onSubmit={handleStartQuestionEntry} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">1. Name of Quiz</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS401: Cloud Computing Quiz 1"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">2. Total Questions</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      required
                      value={qCount}
                      onChange={(e) => setQCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">3. Total Marks</label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      required
                      value={qMarks}
                      onChange={(e) => setQMarks(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-600" /> 4. Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      required
                      value={qDuration}
                      onChange={(e) => setQDuration(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" /> 5. Deadline (Date & Time)
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={qDeadline}
                      onChange={(e) => setQDeadline(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Next: Add Questions ({qCount}) →
                  </button>
                </div>
              </form>
            )}

            {quizStep === "QUESTIONS" && (
              <form onSubmit={handleSaveQuestion} className="p-6 space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-black text-purple-700">Question {currentQIndex + 1} of {qCount}</span>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currCompulsory}
                      onChange={(e) => setCurrCompulsory(e.target.checked)}
                      className="accent-purple-600"
                    />
                    Compulsory Question
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Question Prompt</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter question statement..."
                    value={currPrompt}
                    onChange={(e) => setCurrPrompt(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Marks</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={currMarks}
                      onChange={(e) => setCurrMarks(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Question Type</label>
                    <select
                      value={currType}
                      onChange={(e: any) => {
                        setCurrType(e.target.value);
                        if (e.target.value === "ONE_WORD") setCurrAnswer("");
                      }}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="SINGLE_CHOICE">Single Choice (Radio)</option>
                      <option value="MULTIPLE_CHOICE">Multiple Choice (Checkboxes)</option>
                      <option value="ONE_WORD">One Word Answer</option>
                    </select>
                  </div>
                </div>

                {currType !== "ONE_WORD" ? (
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-bold uppercase text-slate-700">Answer Choices & Correct Key</label>
                    {currOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type={currType === "SINGLE_CHOICE" ? "radio" : "checkbox"}
                          name="correct-option"
                          checked={currAnswer === opt}
                          onChange={() => setCurrAnswer(opt)}
                          className="accent-purple-600"
                        />
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => {
                            const copy = [...currOptions];
                            copy[idx] = e.target.value;
                            setCurrOptions(copy);
                            if (currAnswer === opt) setCurrAnswer(e.target.value);
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Expected One-Word Answer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Next.js or React"
                      value={String(currAnswer)}
                      onChange={(e) => setCurrAnswer(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    {currentQIndex + 1 < qCount ? `Save & Next (${currentQIndex + 2}/${qCount}) →` : "Save & Choose Audience →"}
                  </button>
                </div>
              </form>
            )}

            {quizStep === "AUDIENCE" && (
              <div className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">Publish Quiz To:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTargetAudience("ALL")}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        targetAudience === "ALL" ? "bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 font-bold" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <p className="text-xs text-slate-900 font-extrabold">1. All Students 👥</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Every enrolled student.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetAudience("SELECTED")}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        targetAudience === "SELECTED" ? "bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 font-bold" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <p className="text-xs text-slate-900 font-extrabold">2. Selected Students 🎯</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Choose specific learners.</p>
                    </button>
                  </div>
                </div>

                {targetAudience === "SELECTED" && (
                  <div className="space-y-2 border border-slate-200 p-3.5 rounded-2xl bg-slate-50 max-h-40 overflow-y-auto">
                    <p className="text-[11px] font-bold text-slate-700">Select Students:</p>
                    {studentsList.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(s.name)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedStudents([...selectedStudents, s.name]);
                            else setSelectedStudents(selectedStudents.filter((x) => x !== s.name));
                          }}
                          className="accent-purple-600"
                        />
                        {s.name} ({s.email})
                      </label>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex justify-between">
                  <button
                    onClick={() => setQuizStep("QUESTIONS")}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 cursor-pointer"
                  >
                    Back to Questions
                  </button>
                  <button
                    onClick={handlePublishQuiz}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Publish Quiz to Students 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW RESULTS (TEACHER) */}
      {viewingQuizResults && isTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-amber-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase">Assessment Evaluation</span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" /> Quiz Results: {viewingQuizResults.title}
                </h3>
              </div>
              <button onClick={() => setViewingQuizResults(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Attended</span>
                  <p className="text-xl font-black text-slate-900 mt-0.5">{viewingQuizResults.submissions.length}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Marks</span>
                  <p className="text-xl font-black text-purple-700 mt-0.5">{viewingQuizResults.totalMarks} pts</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Duration Limit</span>
                  <p className="text-xl font-black text-indigo-700 mt-0.5">{viewingQuizResults.durationMinutes}m</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> Student Leaderboard (Ranked by Score & Speed)
                </h4>

                {viewingQuizResults.submissions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No students have taken this quiz yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {viewingQuizResults.submissions
                      .sort((a, b) => b.score - a.score || a.timeTakenSeconds - b.timeTakenSeconds)
                      .map((sub, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                              idx === 0 ? "bg-amber-100 text-amber-800" :
                              idx === 1 ? "bg-slate-200 text-slate-700" :
                              idx === 2 ? "bg-amber-50 text-amber-900 border border-amber-300" : "bg-slate-100 text-slate-500"
                            }`}>
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                            </span>
                            <span className="text-lg">{sub.studentAvatar}</span>
                            <div>
                              <p className="text-xs font-black text-slate-900">{sub.studentName}</p>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-indigo-500" /> Time Taken: {formatSeconds(sub.timeTakenSeconds)}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-black text-purple-700">{sub.score} / {viewingQuizResults.totalMarks} Marks</p>
                            <span className="text-[10px] font-semibold text-emerald-600">Submitted</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingQuizResults(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT ATTEMPT MODAL WITH TIMER */}
      {activeQuizToTake && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">Live Examination</span>
                <h3 className="text-lg font-black">{activeQuizToTake.title}</h3>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20">
                <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
                <span className="font-mono font-black text-sm">{formatSeconds(quizTimer)}</span>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {quizSubmittedResult ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                    🎉
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Quiz Completed!</h4>
                  <div className="p-4 bg-purple-50 rounded-2xl max-w-sm mx-auto space-y-1">
                    <p className="text-sm font-bold text-slate-700">Your Score:</p>
                    <p className="text-3xl font-black text-purple-700">
                      {quizSubmittedResult.score} / {quizSubmittedResult.total} Marks
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      Time Taken: {formatSeconds(quizSubmittedResult.timeTaken)}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveQuizToTake(null)}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Done & Return to Session
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-5">
                    {activeQuizToTake.questions.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-black text-slate-900">
                            {idx + 1}. {q.prompt}
                          </p>
                          <div className="flex items-center gap-1.5">
                            {q.isCompulsory && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-md">
                                Compulsory
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded-md">
                              {q.marks} Marks
                            </span>
                          </div>
                        </div>

                        {q.type === "SINGLE_CHOICE" && (
                          <div className="space-y-1.5">
                            {q.options.map((opt) => (
                              <label
                                key={opt}
                                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs border cursor-pointer transition-colors ${
                                  studentAnswers[q.id] === opt ? "bg-purple-100 border-purple-400 font-bold" : "bg-white border-slate-200"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={studentAnswers[q.id] === opt}
                                  onChange={() => setStudentAnswers({ ...studentAnswers, [q.id]: opt })}
                                  className="accent-purple-600"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === "MULTIPLE_CHOICE" && (
                          <div className="space-y-1.5">
                            {q.options.map((opt) => {
                              const currList = studentAnswers[q.id] || [];
                              const isChecked = currList.includes(opt);
                              return (
                                <label
                                  key={opt}
                                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs border cursor-pointer transition-colors ${
                                    isChecked ? "bg-purple-100 border-purple-400 font-bold" : "bg-white border-slate-200"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) setStudentAnswers({ ...studentAnswers, [q.id]: [...currList, opt] });
                                      else setStudentAnswers({ ...studentAnswers, [q.id]: currList.filter((x: any) => x !== opt) });
                                    }}
                                    className="accent-purple-600"
                                  />
                                  {opt}
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {q.type === "ONE_WORD" && (
                          <div>
                            <input
                              type="text"
                              placeholder="Type single word answer..."
                              value={studentAnswers[q.id] || ""}
                              onChange={(e) => setStudentAnswers({ ...studentAnswers, [q.id]: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Answered {Object.keys(studentAnswers).length} of {activeQuizToTake.questions.length} questions
                    </span>
                    <button
                      onClick={handleStudentSubmitQuiz}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      Submit Exam Now ✓
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PARTICIPANTS MODAL */}
      {showParticipantsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Class Directory</span>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Class Participants ({teachersList.length + studentsList.length})
                </h3>
              </div>
              <button onClick={() => setShowParticipantsModal(false)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-purple-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Instructors & Co-Teachers ({teachersList.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-purple-100 rounded-2xl overflow-hidden bg-purple-50/20">
                  {teachersList.map((t) => (
                    <div key={t.id} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                          👨‍🏫
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{t.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{t.email}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-purple-600 bg-white border border-purple-200 px-2.5 py-1 rounded-xl">
                        {t.joinedAt}
                      </span>
                    </div>
                  ))}
                </div>

                {isTeacher && (
                  <form onSubmit={handleAddTeacher} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-purple-600" />
                      <h5 className="text-xs font-bold text-slate-800">Add Co-Teacher</h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Teacher Full Name"
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Teacher Email (@vlearn.edu)"
                        value={newTeacherEmail}
                        onChange={(e) => setNewTeacherEmail(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer">
                      Authorize & Add Teacher 👨‍🏫
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-indigo-700 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Enrolled Students ({studentsList.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {studentsList.map((s) => (
                    <div key={s.id} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">
                          🎓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{s.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{s.email}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                        Active Learner
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setShowParticipantsModal(false)} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD LECTURE MODAL */}
      {showUploadModal && isTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-5 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Upload New Lecture 📹</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadLecture} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 2: System Architecture"
                  value={lecTitle}
                  onChange={(e) => setLecTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Topic Notes</label>
                <textarea
                  rows={2}
                  value={lecDesc}
                  onChange={(e) => setLecDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                  Publish Lecture 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLASSROOM CHAT DRAWER */}
      {showChat && (
        <div className="fixed right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden">
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
            <h3 className="font-black text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Classroom Live Chat
            </h3>
            <button onClick={() => setShowChat(false)} className="text-indigo-100 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.length === 0 ? (
              <p className="text-center text-slate-400 py-10">No messages yet. Say hi to your classmates!</p>
            ) : (
              messages.map((m: any, idx: number) => (
                <div key={idx} className={`flex flex-col ${m.sender === currentUser.name ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-slate-400 mb-0.5">{m.sender} • {m.time}</span>
                  <div className={`p-2.5 rounded-2xl max-w-[85%] ${
                    m.sender === currentUser.name ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-slate-800 border rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="Type message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border rounded-xl text-xs"
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-xl cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* LIVE MEETING */}
      {showMeeting && isTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col text-white">
            <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
              <h3 className="font-black text-sm">VLearn Live Room: Interactive Lecture</h3>
              <button onClick={() => setShowMeeting(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200" alt="Live Room" className="w-full h-full object-cover" />
            </div>
            <div className="p-4 bg-slate-800 flex justify-center gap-4">
              <button onClick={() => setShowMeeting(false)} className="px-5 py-2.5 bg-rose-600 rounded-xl text-xs font-bold cursor-pointer">
                End Meeting
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
