export default function TopBar() {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 gap-4 shrink-0">
      {/* Search */}
      <button
        type="button"
        aria-label="Search"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-sm font-semibold select-none">
        U
      </div>

      {/* Notification bell */}
      <button
        type="button"
        aria-label="Notifications"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
    </header>
  );
}
