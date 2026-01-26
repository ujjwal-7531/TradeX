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

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  useEffect(() => {
    // Fetching the last 50 transactions for the dedicated page
    fetchTransactions(50, 0)
      .then((res) => {
        setTransactions(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing last 50 transactions
          </span>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading history...</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <TransactionsTable transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;