"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface InterviewSession {
  interviewId: string;
  questions: string[];
}

export default function InterviewSessionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("interview");
    if (!stored) { router.push("/mock-interviews"); return; }
    const data: InterviewSession = JSON.parse(stored);
    setSession(data);
    // Restore saved answers if user navigated away mid-session
    const savedAnswers = sessionStorage.getItem("interview-answers");
    setAnswers(savedAnswers ? JSON.parse(savedAnswers) : Array(data.questions.length).fill(""));
    setCompleted(Array(data.questions.length).fill(false));
  }, [router]);

  // Persist answers to sessionStorage on every change
  useEffect(() => {
    if (answers.length > 0) {
      sessionStorage.setItem("interview-answers", JSON.stringify(answers));
    }
  }, [answers]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { questions, interviewId } = session;
  const isLast = current === questions.length - 1;
  const initials = user?.name?.charAt(0).toUpperCase() ?? "U";

  const handleNext = () => {
    const next = [...completed];
    next[current] = true;
    setCompleted(next);
    setCurrent((c) => c + 1);
  };

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    const next = [...completed];
    next[current] = true;
    setCompleted(next);
    try {
      await api.post(`/interview/submit/${interviewId}`, { answers });
      sessionStorage.removeItem("interview");
      sessionStorage.removeItem("interview-answers");
      router.push(`/mock-interviews/results?id=${interviewId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit");
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Question sidebar */}
      <aside className="w-64 min-h-screen bg-[#1e3464] flex flex-col shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#2a4278]">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center shrink-0">
            <span className="text-[#1e3464] font-bold text-xs">AI</span>
          </div>
          <span className="text-white text-sm font-semibold leading-tight">AI Interview Coach</span>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
          {questions.map((_, i) => {
            const isActive = i === current;
            const isDone = completed[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left w-full transition-colors ${
                  isActive ? "bg-[#3b5bdb] text-white" : "text-[#8fa3c4] hover:text-white hover:bg-[#2a4278]"
                }`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isDone ? "bg-[#22c55e] border-[#22c55e] text-white" : isActive ? "border-white" : "border-[#8fa3c4]"
                }`}>
                  {isDone && "✓"}
                </span>
                <span className="truncate">Question {i + 1}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-4 shrink-0">
          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-semibold select-none">
            {initials}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="w-full">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3b5bdb] rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 font-medium shrink-0">
                {current + 1} / {questions.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
              <p className="text-lg font-semibold text-[#1a2f5e]">{questions[current]}</p>
            </div>

            <label className="text-sm font-medium text-gray-600 block mb-2">Your Answer</label>
            <textarea
              value={answers[current] ?? ""}
              onChange={(e) => {
                const next = [...answers];
                next[current] = e.target.value;
                setAnswers(next);
              }}
              rows={10}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#3b5bdb] transition resize-none placeholder:text-gray-400"
            />

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 mt-4">
              {!isLast && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Next
                </button>
              )}
              {isLast && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-[#3b5bdb] text-white font-semibold rounded-lg hover:bg-[#3451c7] transition disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Interview"}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
