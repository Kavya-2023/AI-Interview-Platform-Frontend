"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface Interview {
  _id: string;
  role: string;
  topic: string;
  score: number;
  status: "in-progress" | "completed";
  questions: string[];
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleContinue = (interview: Interview) => {
    sessionStorage.setItem(
      "interview",
      JSON.stringify({ interviewId: interview._id, questions: interview.questions })
    );
    router.push("/mock-interviews/session");
  };

  useEffect(() => {
    api.get<Interview[]>("/interview/history")
      .then(setInterviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completed = interviews.filter(i => i.score !== null && i.score !== undefined);
  const total = interviews.length;
  const avgScore = completed.length
    ? ((completed.reduce((s, i) => s + (i.score ?? 0), 0) / completed.length) / 10).toFixed(1)
    : "—";
  const recent = completed.slice(0, 3);
  const inProgress = interviews.filter(i => i.score === null || i.score === undefined).slice(0, 1);

  return (
    <div className="flex flex-col gap-5 w-full">
      <h1 className="text-xl font-bold text-[#1a2f5e]">
        Welcome back, {user?.name?.split(" ")[0]} 👋
      </h1>

      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard label="Interviews Taken" value={loading ? "…" : String(total)} icon="📋" />
        <StatCard label="Average Score" value={loading ? "…" : `${avgScore}`} icon="📊" />
        <StatCard label="Topics Practiced" value={loading ? "…" : String(new Set(interviews.map(i => i.topic)).size)} icon="📚" />
      </div>

      {/* In-progress banner — show only the latest one */}
      {!loading && inProgress.map(item => (
        <div key={item._id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-amber-800">You have an unfinished interview</p>
              <p className="text-xs text-amber-600">{item.role} · {item.topic}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleContinue(item)}
            className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition"
          >
            Continue →
          </button>
        </div>
      ))}

      {/* Recent Interviews */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1a2f5e]">Recent Interviews</h2>
          <Link href="/history" className="text-sm text-[#3b5bdb] hover:underline">
            See all history
          </Link>
        </div>

        {loading ? (
          <div className="py-6 flex justify-center">
            <div className="w-6 h-6 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            No interviews yet.{" "}
            <Link href="/mock-interviews" className="text-[#3b5bdb] hover:underline">Start one!</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((item) => (
              <Link
                key={item._id}
                href={`/mock-interviews/results?id=${item._id}`}
                className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#eef2ff] rounded-lg flex items-center justify-center shrink-0">
                    <svg width="15" height="15" fill="#3b5bdb" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.role} · {item.topic}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-500">
                    Score: <span className="font-semibold text-gray-800">{(item.score / 10).toFixed(1)}/10</span>
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick start */}
      <Link
        href="/mock-interviews"
        className="bg-[#3b5bdb] text-white rounded-xl p-5 flex items-center justify-between hover:bg-[#3451c7] transition"
      >
        <div>
          <p className="font-semibold">Start a New Mock Interview</p>
          <p className="text-sm text-blue-200 mt-0.5">AI-generated questions tailored to your role</p>
        </div>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex-1 min-w-0 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-[#1a2f5e]">{value}</p>
      </div>
    </div>
  );
}
