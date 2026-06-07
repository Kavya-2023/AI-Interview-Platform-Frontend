"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DeleteModal from "@/components/DeleteModal";

interface Interview {
  _id: string;
  role: string;
  topic: string;
  score: number;
  questions: string[];
  createdAt: string;
}

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.get<Interview[]>("/interview/history")
      .then(setInterviews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleContinue = (interview: Interview) => {
    sessionStorage.setItem(
      "interview",
      JSON.stringify({ interviewId: interview._id, questions: interview.questions })
    );
    router.push("/mock-interviews/session");
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    try {
      await api.delete(`/interview/${confirmId}`);
      setInterviews((prev) => prev.filter((i) => i._id !== confirmId));
      setConfirmId(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {confirmId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
          loading={deletingId === confirmId}
        />
      )}

      <h1 className="text-2xl font-bold text-[#1a2f5e] mb-6">Interview History</h1>

      {loading && (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && interviews.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-500 mb-3">You haven&apos;t taken any interviews yet.</p>
          <Link
            href="/mock-interviews"
            className="inline-block px-6 py-2.5 bg-[#3b5bdb] text-white text-sm font-semibold rounded-lg hover:bg-[#3451c7] transition"
          >
            Start your first interview
          </Link>
        </div>
      )}

      {!loading && interviews.length > 0 && (
        <div className="flex flex-col gap-3">
          {interviews.map((item) => {
            const isInProgress = item.score === null || item.score === undefined;
            return (
              <div key={item._id} className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isInProgress ? "bg-amber-50" : "bg-[#eef2ff]"}`}>
                    {isInProgress ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="#3b5bdb" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#1a2f5e]">{item.role} · {item.topic}</p>
                      {isInProgress && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isInProgress ? (
                    <button
                      type="button"
                      onClick={() => handleContinue(item)}
                      className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition"
                    >
                      Continue →
                    </button>
                  ) : (
                    <>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.score >= 80 ? "bg-green-100 text-green-700" :
                        item.score >= 60 ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-600"
                      }`}>
                        {(item.score / 10).toFixed(1)}/10
                      </span>
                      <Link href={`/mock-interviews/results?id=${item._id}`} className="text-gray-300 hover:text-gray-500">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => setConfirmId(item._id)}
                    className="text-gray-300 hover:text-red-400 transition"
                    title="Delete"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
