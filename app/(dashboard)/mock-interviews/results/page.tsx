"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface InterviewResult {
  role: string;
  topic: string;
  score: number;
  feedback: string;
  questions: string[];
  answers: string[];
}

export default function InterviewResultsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) { setError("No interview ID found."); setLoading(false); return; }
    api.get<InterviewResult>(`/interview/${id}`)
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-lg flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-lg">
        <p className="text-red-500">{error || "Failed to load results."}</p>
        <Link href="/mock-interviews" className="text-[#3b5bdb] text-sm mt-2 inline-block hover:underline">
          Try again
        </Link>
      </div>
    );
  }

  const score = +(result.score / 10).toFixed(1);
  const maxScore = 10;
  const pct = (score / maxScore) * 100;

  const feedbackLines = result.feedback
    ? result.feedback.split("\n").filter(Boolean)
    : [];

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#1a2f5e] mb-1">Interview Results</h1>
      <p className="text-sm text-gray-500 mb-6">{result.role} · {result.topic}</p>

      {/* Top row: score + feedback side by side */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Score card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500 mb-4">Your Score</p>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eef2ff" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#3b5bdb" strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#1a2f5e]">{score}</span>
                <span className="text-xs text-gray-400">/ {maxScore}</span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#3b5bdb] rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* AI Feedback card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">AI Feedback</p>
          <ul className="flex flex-col gap-2.5 overflow-y-auto max-h-52">
            {feedbackLines.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3b5bdb]" />
                {line.replace(/^[-•]\s*/, "")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Q&A grid */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Your Answers</p>
        <div className="flex flex-col gap-3">
          {result.questions.map((q, i) => (
            <div key={i} className="rounded-lg bg-gray-50 p-4 flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#eef2ff] text-[#3b5bdb] text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1a2f5e] mb-1">{q}</p>
                <p className="text-sm text-gray-500">{result.answers[i] || <em className="text-gray-400">No answer given</em>}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/mock-interviews"
          className="px-8 py-3 bg-[#3b5bdb] text-white font-semibold rounded-lg hover:bg-[#3451c7] transition text-sm"
        >
          New Interview
        </Link>
        <Link
          href="/dashboard"
          className="px-8 py-3 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition text-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
