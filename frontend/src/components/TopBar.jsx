import { useEffect, useRef, useState } from "react";

function TopBar({ email, onLogout, onToggleTheme, isDark }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      {/* Left */}
      <h1 className="text-xl font-bold text-black dark:text-white">
        TradeX
      </h1>

      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        <button
          aria-label="User menu"
          onClick={() => setOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {email?.[0]?.toUpperCase() || "U"}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
            {/* Email */}
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Signed in as
              </p>
              <p className="text-sm font-medium text-black dark:text-white truncate">
                {email}
              </p>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => {
                onToggleTheme();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm
                text-gray-800 dark:text-gray-200
                hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>

            {/* Edit balance (stub for now) */}
            <button
              onClick={() => setOpen(false)}
              className="w-full text-left px-4 py-2 text-sm
                text-gray-800 dark:text-gray-200
                hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Edit balance
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm
                text-red-600 dark:text-red-400
                hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
