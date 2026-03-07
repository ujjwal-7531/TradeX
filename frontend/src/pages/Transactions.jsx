import { useEffect, useState } from "react";
import api from "../api/axios";
import { fetchTransactions } from "../api/transactions";
import TransactionsTable from "../components/TransactionsTable";
import TopBar from "../components/TopBar";
import { removeToken, getEmail } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [limit, setLimit] = useState(20);
  const [downloading, setDownloading] = useState(false);

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

  const downloadCSV = async () => {
    try {
      setDownloading(true);
      
      const response = await api.get('/transactions/export/csv', {
        responseType: 'blob' // Tell axios to expect a binary file
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TradeX_Tax_Report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download tax report. Please try again later.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TopBar
        email={getEmail() || "user@example.com"}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      <div className="p-6 sm:p-8 text-black dark:text-white max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Transaction History</h2>

          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
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
          
          <button
            onClick={downloadCSV}
            disabled={downloading}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 ${
              downloading 
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            }`}
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Export CSV
              </>
            )}
          </button>
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
