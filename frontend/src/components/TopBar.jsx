import { useEffect, useRef, useState } from "react"; // Single import for useState
import { NavLink } from "react-router-dom";
import EditBalanceModal from "./EditBalanceModal";
import { updateBalance } from "../api/portfolio";

// Added refreshData here so the component can use it
function TopBar({ email, onLogout, onToggleTheme, isDark, refreshData }) {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5"
    }`;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateBalance = async (amount) => {
    try {
      await updateBalance(amount);

      setIsModalOpen(false); // Close the modal

      // 2. Call the refresh function passed from Dashboard
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error("Failed to update balance", error);
      alert("Error updating balance. Please try again.");
    }
  };
// testing
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 sticky top-0 z-40 transition-colors duration-300">
      {/* Left: Brand/Logo */}
      <NavLink
        to="/dashboard"
        className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity"
      >
        TradeX
      </NavLink>

      {/* Right: Nav + User Menu */}
      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex items-center space-x-4 mr-4 border-r border-gray-200 dark:border-gray-700 pr-6">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/holdings" className={navLinkClass}>
            Holdings
          </NavLink>
          <NavLink to="/transactions" className={navLinkClass}>
            Transactions
          </NavLink>
          <NavLink to="/watchlist" className={navLinkClass}>
            Watchlist
          </NavLink>
        </nav>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center justify-center font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            {email?.[0]?.toUpperCase() || "U"}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden transition-all origin-top-right animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-black dark:text-white truncate">
                  {email}
                </p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onToggleTheme();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
                </button>

                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ⚙️ Edit balance
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 border-t dark:border-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateBalance}
      />
    </div>
  );
}

export default TopBar;
