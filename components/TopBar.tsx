"use client";

import { useAuth } from "@/lib/auth-context";

export default function TopBar() {
  const { user, logout } = useAuth();
  const initials = user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-4 shrink-0">
      <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-semibold select-none">
        {initials}
      </div>

      <button
        type="button"
        onClick={logout}
        title="Logout"
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </header>
  );
}
