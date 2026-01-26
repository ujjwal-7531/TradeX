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
    `px-3 py-2 text-sm font-medium transition-all ${
      isActive
        ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
        : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
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
    <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      {/* Left: Brand/Logo */}
      <NavLink
        to="/dashboard"
        className="text-xl font-bold text-black dark:text-white tracking-tight"
      >
        TradeX
      </NavLink>

      {/* Right: Nav + User Menu */}
      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex items-center space-x-2 mr-4 border-r dark:border-gray-700 pr-6">
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
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {email?.[0]?.toUpperCase() || "U"}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-xl z-50">
              <div className="px-4 py-3 border-b dark:border-gray-700">
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
