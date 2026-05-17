import Link from "next/link";

const STRENGTHS = ["Strong React knowledge", "Clear communication"];
const IMPROVEMENTS = ["Improve on algorithms", "Work on system design"];

export default function InterviewResultsPage() {
  const score = 7.5;
  const maxScore = 10;
  const pct = (score / maxScore) * 100;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-[#1a2f5e] mb-6">Interview Results</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
        {/* Score */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-3">Your Score</p>
          <div className="flex items-center gap-4">
            {/* Progress bar */}
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3b5bdb] rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* Badge */}
            <div className="shrink-0 bg-amber-100 text-amber-700 font-bold text-lg px-4 py-1.5 rounded-lg whitespace-nowrap">
              {score} / {maxScore}
            </div>
          </div>
        </div>

        {/* Strengths & Areas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm font-semibold text-gray-700">Strengths</span>
            </div>
            <ul className="flex flex-col gap-2">
              {STRENGTHS.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="shrink-0 mt-0.5 text-green-500"
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-sm font-semibold text-gray-700">Areas for Improvement</span>
            </div>
            <ul className="flex flex-col gap-2">
              {IMPROVEMENTS.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Link
            href="/mock-interviews"
            className="flex-1 py-3 bg-[#3b5bdb] text-white font-semibold rounded-lg hover:bg-[#3451c7] transition text-center text-sm"
          >
            Review Answers
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition text-center text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
