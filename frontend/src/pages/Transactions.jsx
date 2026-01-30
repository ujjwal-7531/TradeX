import { useEffect, useState } from "react";
import { fetchTransactions } from "../api/transactions";
import TransactionsTable from "../components/TransactionsTable";
import TopBar from "../components/TopBar";
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Add state for the limit (default to 10 or 20)
  const [limit, setLimit] = useState(20);

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  // 2. Add limit to the dependency array so it refetches when changed
  useEffect(() => {
    setLoading(true);
    fetchTransactions(limit, 0)
      .then((res) => {
        setTransactions(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [limit]); // Re-run effect whenever 'limit' changes

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TopBar
        email="user@example.com"
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      <div className="p-6 text-black dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Transaction History</h2>
          
          {/* 3. Add the Dropdown UI */}
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Show:
            </label>
            {/* Replace the select div with this */}
<div className="flex items-center space-x-3">
  <label className="text-sm text-gray-500 dark:text-gray-400">
    Limit:
  </label>
  <input
    type="number"
    min="1"
    max="500" // Safety cap
    value={limit}
    onChange={(e) => setLimit(Number(e.target.value))}
    className="w-16 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-center"
  />
</div>
          </div>
        </div>

        {loading ? (
  <p className="text-gray-500">Loading history...</p>
) : (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    {/* This wrapper enables internal scrolling */}
    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
      <TransactionsTable transactions={transactions} />
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Transactions;