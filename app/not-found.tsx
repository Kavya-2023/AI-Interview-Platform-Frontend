import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#eef1fb] flex flex-col items-center justify-center gap-4">
      <div className="text-6xl font-bold text-[#3b5bdb]">404</div>
      <h1 className="text-xl font-semibold text-[#1a2f5e]">Page not found</h1>
      <p className="text-sm text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/dashboard"
        className="mt-2 px-6 py-2.5 bg-[#3b5bdb] text-white text-sm font-semibold rounded-lg hover:bg-[#3451c7] transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
