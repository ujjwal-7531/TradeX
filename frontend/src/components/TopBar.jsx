import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import EditBalanceModal from "./EditBalanceModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { updateBalance } from "../api/portfolio";
import { getFullName } from "../utils/auth";
import api from "../api/axios";
import toast from "react-hot-toast";

// Added refreshData here so the component can use it
function TopBar({ email, onLogout, onToggleTheme, isDark, refreshData }) {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Edit balance"
          >
            ⚙️
          </button>

          <div className="pl-2 border-l border-gray-200 dark:border-gray-700">
            <UserButton 
              afterSignOutUrl="/login"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-blue-500/30 shadow-md"
                }
              }}
            />
          </div>
        </div>
      </div>

      <EditBalanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateBalance}
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
