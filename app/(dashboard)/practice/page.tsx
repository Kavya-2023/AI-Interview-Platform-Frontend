"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const TOPICS = [
  { label: "React", icon: "⚛️", role: "Frontend" },
  { label: "Node.js", icon: "🟢", role: "Backend" },
  { label: "DSA", icon: "🧠", role: "Backend" },
  { label: "TypeScript", icon: "🔷", role: "Frontend" },
  { label: "System Design", icon: "🏗️", role: "Full Stack" },
  { label: "Python", icon: "🐍", role: "Data Science" },
];

type Stage = "pick" | "answer" | "feedback";

interface FeedbackData {
  score: number;
  feedback: string;
}

export default function PracticePage() {
  const [stage, setStage] = useState<Stage>("pick");
  const [selectedTopic, setSelectedTopic] = useState<(typeof TOPICS)[0] | null>(null);
  const [interviewId, setInterviewId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTopicSelect = async (topic: (typeof TOPICS)[0]) => {
    setSelectedTopic(topic);
    setError("");
    setLoading(true);
    try {
      const data = await api.post<{ _id: string; questions: string[] }>("/interview/generate", {
        role: topic.role,
        topic: topic.label,
        numQuestions: 1,
      });
      setInterviewId(data._id);
      setQuestion(data.questions[0]);
      setStage("answer");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setError("");
    setLoading(true);
    try {
      const data = await api.post<{ score: number; feedback: string }>(
        `/interview/submit/${interviewId}`,
        { answers: [answer] }
      );
      setFeedbackData({ score: +(data.score / 10).toFixed(1), feedback: data.feedback });
      setStage("feedback");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStage("pick");
    setSelectedTopic(null);
    setQuestion("");
    setAnswer("");
    setFeedbackData(null);
    setError("");
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#1a2f5e] mb-1">Practice</h1>
      <p className="text-sm text-gray-500 mb-6">Pick a topic, answer one question, get instant AI feedback.</p>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      {/* Stage: Pick topic */}
      {stage === "pick" && (
        <div>
          {loading ? (
            <div className="py-16 flex items-center justify-center gap-3 text-gray-400">
              <div className="w-6 h-6 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Generating question...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => handleTopicSelect(topic)}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md hover:border-[#3b5bdb] border border-transparent transition-all group"
                >
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <p className="font-semibold text-[#1a2f5e] group-hover:text-[#3b5bdb] transition-colors">
                    {topic.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{topic.role}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stage: Answer */}
      {stage === "answer" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{selectedTopic?.icon}</span>
            <span className="font-semibold text-[#1a2f5e]">{selectedTopic?.label}</span>
            <button type="button" onClick={handleReset} className="ml-auto text-sm text-gray-400 hover:text-gray-600">
              ← Change topic
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
            <p className="text-xs font-semibold text-[#3b5bdb] uppercase tracking-wide mb-2">Question</p>
            <p className="text-base font-semibold text-[#1a2f5e]">{question}</p>
          </div>

          <label className="text-sm font-medium text-gray-600 block mb-2">Your Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#3b5bdb] transition resize-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
            className="mt-4 px-8 py-3 bg-[#3b5bdb] text-white font-semibold rounded-lg hover:bg-[#3451c7] transition disabled:opacity-60"
          >
            {loading ? "Evaluating..." : "Get Feedback"}
          </button>
        </div>
      )}

      {/* Stage: Feedback */}
      {stage === "feedback" && feedbackData && (
        <div>
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* Score */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-gray-500 mb-4">Your Score</p>
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eef2ff" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#3b5bdb" strokeWidth="3"
                    strokeDasharray={`${feedbackData.score * 10} ${100 - feedbackData.score * 10}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-[#1a2f5e]">{feedbackData.score}</span>
                  <span className="text-xs text-gray-400">/ 10</span>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">AI Feedback</p>
              <p className="text-sm text-gray-600 leading-relaxed">{feedbackData.feedback}</p>
            </div>
          </div>

          {/* Your answer recap */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
            <p className="text-xs font-semibold text-[#3b5bdb] uppercase tracking-wide mb-2">Question</p>
            <p className="text-sm font-semibold text-[#1a2f5e] mb-3">{question}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Your Answer</p>
            <p className="text-sm text-gray-600">{answer}</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setStage("answer"); setAnswer(""); setFeedbackData(null); }}
              className="px-8 py-3 bg-[#3b5bdb] text-white font-semibold rounded-lg hover:bg-[#3451c7] transition text-sm"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-3 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Pick Another Topic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
