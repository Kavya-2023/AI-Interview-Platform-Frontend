"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const QUESTIONS = [
  "What is the Virtual DOM in React and how does it work?",
  "Explain the Virtual DOM in React?",
  "What are React Hooks and why were they introduced?",
  "What is the difference between controlled and uncontrolled components?",
  "Explain the concept of lifting state up in React.",
];

export default function InterviewSessionPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(1);
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));
  const [completed, setCompleted] = useState<boolean[]>(Array(QUESTIONS.length).fill(false));

  const answer = answers[current];
  const isLast = current === QUESTIONS.length - 1;

  function handleSubmit() {
    const next = [...completed];
    next[current] = true;
    setCompleted(next);

    if (isLast) {
      router.push("/mock-interviews/results");
    } else {
      setCurrent((c) => c + 1);
    }
  }

  return (
    <>
      {/* Question sidebar */}
      <aside className="w-52 min-h-screen bg-[#1e3464] flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#2a4278]">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center shrink-0">
            <span className="text-[#1e3464] font-bold text-xs">AI</span>
          </div>
          <span className="text-white text-sm font-semibold leading-tight">
            AI Interview Coach
          </span>
        </div>

        {/* Question list */}
        <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
          {QUESTIONS.map((_, i) => {
            const isActive = i === current;
            const isDone = completed[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left w-full transition-colors ${
                  isActive
                    ? "bg-[#3b5bdb] text-white"
                    : "text-[#8fa3c4] hover:text-white hover:bg-[#2a4278]"
                }`}
              >
                {/* Checkbox indicator */}
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    isDone
                      ? "bg-[#22c55e] border-[#22c55e] text-white"
                      : isActive
                      ? "border-white"
                      : "border-[#8fa3c4]"
                  }`}
                >
                  {isDone && "✓"}
                </span>
                <span className="truncate">{i + 1} Question {i + 1}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-4 shrink-0">
          <button type="button" aria-label="Search" className="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-semibold select-none">
            U
          </div>
          <button type="button" aria-label="Menu" className="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-xl">
            <p className="text-sm text-gray-500 mb-3 font-medium">
              Question {current + 1} of {QUESTIONS.length}
            </p>

            {/* Question card */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
              <p className="text-base font-semibold text-[#1a2f5e]">
                {QUESTIONS[current]}
              </p>
            </div>

            {/* Answer */}
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => {
                const next = [...answers];
                next[current] = e.target.value;
                setAnswers(next);
              }}
              rows={5}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#3b5bdb] transition resize-none placeholder:text-gray-400"
            />

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 px-8 py-3 bg-[#3b5bdb] text-white font-semibold rounded-lg hover:bg-[#3451c7] transition"
            >
              {isLast ? "Submit Interview" : "Submit Answer"}
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
