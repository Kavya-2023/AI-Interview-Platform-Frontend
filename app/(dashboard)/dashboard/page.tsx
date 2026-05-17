const RECENT_INTERVIEWS = [
  { title: "React Interview", score: "8.5/10", date: "May 12, 2023" },
  { title: "DSA Session", score: "7/10", date: "May 10, 2023" },
];

const PERFORMANCE_ITEMS = [
  {
    label: "DSA Session",
    path: "M0 24 L40 20 L80 22 L120 16 L160 18 L200 10",
    fill: "M0 24 L40 20 L80 22 L120 16 L160 18 L200 10 L200 32 L0 32Z",
    dotCy: 18,
  },
  {
    label: "Profile",
    path: "M0 20 L40 18 L80 24 L120 20 L160 16 L200 14",
    fill: "M0 20 L40 18 L80 24 L120 20 L160 16 L200 14 L200 32 L0 32Z",
    dotCy: 16,
  },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex-1 min-w-0">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <p className="text-3xl font-bold text-[#1a2f5e]">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard label="Interviews Taken" value="12" />
        <StatCard label="Average Score" value="7.8" />
        <StatCard label="Weak Topics" value="3" />
      </div>

      {/* Recent Interviews */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1a2f5e]">Recent Interviews</h2>
          <button
            type="button"
            className="text-sm text-[#3b5bdb] hover:underline"
          >
            See all history
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {RECENT_INTERVIEWS.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#eef2ff] rounded-lg flex items-center justify-center shrink-0">
                  <svg width="15" height="15" fill="#3b5bdb" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-500">
                  Score:{" "}
                  <span className="font-semibold text-gray-800">
                    {item.score}
                  </span>
                </span>
                <span className="text-sm text-gray-400">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-[#1a2f5e] mb-4">
          Performance Overview
        </h2>

        <div className="flex flex-col gap-3">
          {PERFORMANCE_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-1">
              <div className="flex items-center gap-2 w-28 shrink-0">
                <svg width="15" height="15" fill="#3b5bdb" viewBox="0 0 24 24">
                  <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z" />
                </svg>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>

              {/* Sparkline */}
              <div className="flex-1 h-9 rounded overflow-hidden">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 32"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id={`grad-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b5bdb" stopOpacity="0.15" />
                      <stop
                        offset="100%"
                        stopColor="#3b5bdb"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={item.fill}
                    fill={`url(#grad-${i})`}
                  />
                  <path
                    d={item.path}
                    fill="none"
                    stroke="#3b5bdb"
                    strokeWidth="1.5"
                  />
                  <circle cx="160" cy={item.dotCy} r="4" fill="#22c55e" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
