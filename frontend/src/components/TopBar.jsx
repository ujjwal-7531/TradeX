import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import EditBalanceModal from "./EditBalanceModal";
import ProfileModal from "./ProfileModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { updateBalance } from "../api/portfolio";
import { getFullName, getProfilePicture } from "../utils/auth";
import api from "../api/axios";
import toast from "react-hot-toast";

// Added refreshData here so the component can use it
function TopBar({ email, onLogout, onToggleTheme, isDark, refreshData }) {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(getProfilePicture());
  const [fullName, setFullName] = useState(getFullName());
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

  const handleConfirmDelete = async () => {
    try {
      await api.delete("/users/me");
      toast.success("Account permanently deleted.");
      onLogout();
      setOpen(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete account", error);
      toast.error("Failed to delete account. Please try again.");
      setIsDeleteModalOpen(false);
    }
  };

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
            className="w-10 h-10 rounded-full bg-gradient-to-br border-2 border-white/20 from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center justify-center font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 overflow-hidden"
          >
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : fullName ? (
              fullName.charAt(0).toUpperCase()
            ) : (
              "u"
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden transition-all origin-top-right animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-black dark:text-white truncate">
                  {fullName || email}
                </p>
              </div>

              <div className="p-2 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <span className="mr-3">👤</span>
                  Profile Settings
                </button>

                <button
                  onClick={() => {
                    onToggleTheme();
                    setOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <span className="mr-3">{isDark ? "☀️" : "🌙"}</span>
                  {isDark ? "Light mode" : "Dark mode"}
                </button>

                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <span className="mr-3">⚙️</span>
                  Edit balance
                </button>

                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>

                <button
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 text-sm font-medium text-red-700 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <span className="mr-3 text-lg leading-none mb-0.5">⚠️</span>
                  Delete Account
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setOpen(false);
                  }}
                  className="flex items-center w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <span className="mr-3 text-lg leading-none mb-0.5">🚪</span>
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

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateProfile={(data) => {
          setFullName(data.name);
          setProfilePic(data.picture);
        }}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default TopBar;
