export function formatScore(score: number): string {
  return (score / 10).toFixed(1);
}

export function scoreColorClasses(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-600";
}

export function scoreHexColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}
