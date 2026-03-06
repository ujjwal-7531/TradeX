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

  const [limit, setLimit] = useState(20);

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

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

          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 pl-2">
              View
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-semibold rounded-md outline-none cursor-pointer py-1.5 px-3 border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>All (500)</option>
            </select>
            <span className="text-sm text-gray-500 dark:text-gray-400 pr-2">transactions</span>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading history...</p>
        ) : (
          <div className="w-full">
            <TransactionsTable transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
