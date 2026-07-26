"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { formatScore, scoreHexColor } from "@/lib/score";

interface Interview {
  _id: string;
  role: string;
  topic: string;
  score: number;
  createdAt: string;
}

type Tab = "overview" | "analytics";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    api
      .get<Interview[]>("/interview/history")
      .then(setInterviews)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load your interviews."))
      .finally(() => setLoading(false));
  }, []);

  const completed = interviews.filter(
    (i) => i.score !== null && i.score !== undefined
  );
  const inProgress = interviews.filter(
    (i) => i.score === null || i.score === undefined
  );
  const total = interviews.length;
  const avgScore =
    completed.length
      ? formatScore(completed.reduce((s, i) => s + (i.score ?? 0), 0) / completed.length)
      : "—";
  const bestScore =
    completed.length
      ? formatScore(Math.max(...completed.map((i) => i.score)))
      : "—";
  const topics = new Set(interviews.map((i) => i.topic)).size;

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-[#1a2f5e] mb-6">Profile</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-5">
          {error}
        </div>
      )}

      {/* User card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-6 mb-5">
        <div className="w-20 h-20 rounded-full bg-[#3b5bdb] flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#1a2f5e]">{user?.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          <p className="text-xs text-gray-400 mt-1">Member since {memberSince}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
            tab === "overview"
              ? "bg-white text-[#1a2f5e] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab("analytics")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
            tab === "analytics"
              ? "bg-white text-[#1a2f5e] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Analytics
        </button>
      </div>

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard label="Interviews Taken" value={loading ? "…" : String(total)} icon="📋" />
            <StatCard label="Average Score" value={loading ? "…" : `${avgScore}/10`} icon="📊" />
            <StatCard label="Best Score" value={loading ? "…" : `${bestScore}/10`} icon="🏆" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Topics Practiced" value={loading ? "…" : String(topics)} icon="📚" />
            <StatCard
              label="Latest Interview"
              value={
                loading
                  ? "…"
                  : total === 0
                  ? "None yet"
                  : new Date(interviews[0].createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
              }
              icon="🕐"
            />
          </div>
        </>
      )}

      {tab === "analytics" && (
        <AnalyticsTab
          completed={completed}
          inProgress={inProgress}
          loading={loading}
        />
      )}
    </div>
  );
}

/* ─── Overview stat card ─── */
function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div className="flex flex-col">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-[#1a2f5e]">{value}</p>
      </div>
    </div>
  );
}

/* ─── Analytics tab ─── */
function AnalyticsTab({
  completed,
  inProgress,
  loading,
}: {
  completed: Interview[];
  inProgress: Interview[];
  loading: boolean;
}) {
  const total = completed.length + inProgress.length;
  const completionRate = total === 0 ? 0 : Math.round((completed.length / total) * 100);

  // Score over time — last 10 completed, ascending date order
  const scoreOverTime = [...completed]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-10);

  // Topic-wise average (only completed)
  const topicMap: Record<string, number[]> = {};
  for (const i of completed) {
    if (!topicMap[i.topic]) topicMap[i.topic] = [];
    topicMap[i.topic].push(i.score);
  }
  const topicData = Object.entries(topicMap)
    .map(([topic, scores]) => ({
      topic,
      avg: scores.reduce((s, v) => s + v, 0) / scores.length,
      count: scores.length,
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 6);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-[#3b5bdb] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
        <p className="text-4xl mb-3">📈</p>
        <p className="text-sm">Complete some interviews to see your analytics.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <MiniStat label="Completed" value={String(completed.length)} color="#3b5bdb" />
        <MiniStat label="In Progress" value={String(inProgress.length)} color="#f59e0b" />
        <MiniStat label="Completion Rate" value={`${completionRate}%`} color="#22c55e" />
      </div>

      {/* Completion bar */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-sm font-semibold text-[#1a2f5e] mb-3">Completion Rate</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3b5bdb] rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#1a2f5e] w-10 text-right">
            {completionRate}%
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {completed.length} of {total} interview{total !== 1 ? "s" : ""} submitted
        </p>
      </div>

      {/* Score over time */}
      {scoreOverTime.length >= 2 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm font-semibold text-[#1a2f5e] mb-4">Score Over Time</p>
          <ScoreLineChart data={scoreOverTime} />
        </div>
      )}

      {/* Topic performance */}
      {topicData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm font-semibold text-[#1a2f5e] mb-4">Topic Performance (avg score)</p>
          <TopicBarChart data={topicData} />
        </div>
      )}

      {/* Score distribution */}
      {completed.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-sm font-semibold text-[#1a2f5e] mb-4">Score Distribution</p>
          <ScoreDistribution completed={completed} />
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

/* ─── SVG Line Chart ─── */
function ScoreLineChart({ data }: { data: Interview[] }) {
  const W = 500;
  const H = 140;
  const PAD = { top: 14, right: 20, bottom: 32, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const scores = data.map((d) => d.score / 10);
  const minScore = Math.max(0, Math.floor(Math.min(...scores)) - 1);
  const maxScore = Math.min(10, Math.ceil(Math.max(...scores)) + 1);
  const range = maxScore - minScore || 1;

  const xOf = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * innerW;
  const yOf = (v: number) => PAD.top + (1 - (v - minScore) / range) * innerH;

  const points = scores.map((s, i) => `${xOf(i)},${yOf(s)}`).join(" ");
  const fillPath =
    `M${xOf(0)},${yOf(scores[0])} ` +
    scores.map((s, i) => `L${xOf(i)},${yOf(s)}`).join(" ") +
    ` L${xOf(scores.length - 1)},${PAD.top + innerH} L${xOf(0)},${PAD.top + innerH} Z`;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, minWidth: 240 }}
        aria-label="Score over time line chart"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = PAD.top + t * innerH;
          const label = (maxScore - t * range).toFixed(0);
          return (
            <g key={t}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + innerW}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text x={PAD.left - 6} y={y + 4} fontSize={9} textAnchor="end" fill="#9ca3af">
                {label}
              </text>
            </g>
          );
        })}

        <path d={fillPath} fill="#3b5bdb" fillOpacity={0.08} />

        <polyline points={points} fill="none" stroke="#3b5bdb" strokeWidth={2} strokeLinejoin="round" />

        {scores.map((s, i) => (
          <circle key={i} cx={xOf(i)} cy={yOf(s)} r={3.5} fill="#3b5bdb" />
        ))}

        {data.map((d, i) => (
          <text
            key={i}
            x={xOf(i)}
            y={PAD.top + innerH + 18}
            fontSize={8.5}
            textAnchor="middle"
            fill="#9ca3af"
          >
            {new Date(d.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ─── SVG Bar Chart ─── */
function TopicBarChart({
  data,
}: {
  data: { topic: string; avg: number; count: number }[];
}) {
  const BAR_H = 28;
  const GAP = 10;
  const LABEL_W = 100;
  const BAR_MAX = 260;
  const H = data.length * (BAR_H + GAP) - GAP + 4;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${LABEL_W + BAR_MAX + 60} ${H}`} width="100%" aria-label="Topic bar chart">
        {data.map((d, i) => {
          const y = i * (BAR_H + GAP);
          const barW = (d.avg / 100) * BAR_MAX;
          const displayScore = formatScore(d.avg);
          const color = scoreHexColor(d.avg);
          return (
            <g key={d.topic}>
              <text
                x={LABEL_W - 8}
                y={y + BAR_H / 2 + 4}
                fontSize={11}
                textAnchor="end"
                fill="#374151"
              >
                {d.topic.length > 12 ? d.topic.slice(0, 11) + "…" : d.topic}
              </text>

              <rect x={LABEL_W} y={y} width={BAR_MAX} height={BAR_H} rx={5} fill="#f3f4f6" />

              <rect
                x={LABEL_W}
                y={y}
                width={barW}
                height={BAR_H}
                rx={5}
                fill={color}
                fillOpacity={0.85}
              />

              <text
                x={LABEL_W + BAR_MAX + 10}
                y={y + BAR_H / 2 + 4}
                fontSize={11}
                fill="#1a2f5e"
                fontWeight="700"
              >
                {displayScore}/10
              </text>

              <text
                x={LABEL_W + BAR_MAX + 10}
                y={y + BAR_H / 2 + 16}
                fontSize={9}
                fill="#9ca3af"
              >
                {d.count} session{d.count !== 1 ? "s" : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Score distribution buckets ─── */
function ScoreDistribution({ completed }: { completed: Interview[] }) {
  const buckets = [
    { label: "0–4", min: 0, max: 39, color: "#ef4444" },
    { label: "4–6", min: 40, max: 59, color: "#f59e0b" },
    { label: "6–8", min: 60, max: 79, color: "#3b82f6" },
    { label: "8–10", min: 80, max: 100, color: "#22c55e" },
  ];

  const counts = buckets.map(
    (b) => completed.filter((i) => i.score >= b.min && i.score <= b.max).length
  );
  const maxCount = Math.max(...counts, 1);

  return (
    <div className="flex items-end gap-4" style={{ height: "7rem" }}>
      {buckets.map((b, idx) => {
        const pct = (counts[idx] / maxCount) * 100;
        return (
          <div key={b.label} className="flex flex-col items-center flex-1 gap-1.5 h-full justify-end">
            <span className="text-xs font-bold text-gray-600">{counts[idx]}</span>
            <div
              className="w-full rounded-t-md"
              style={{
                height: `${Math.max(pct, 4)}%`,
                backgroundColor: b.color,
                opacity: 0.8,
              }}
            />
            <span className="text-[10px] text-gray-400">{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}
