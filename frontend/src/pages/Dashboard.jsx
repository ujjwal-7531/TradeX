import { useEffect, useState } from "react";

import { fetchPortfolioSummary } from "../api/portfolio";
import PortfolioSummary from "../components/PortfolioSummary";

import { removeToken, getEmail } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../api/transactions";
import TransactionsTable from "../components/TransactionsTable";
import TopBar from "../components/TopBar";
import MarketOverviewWidget from "../components/MarketOverviewWidget";
import StockHeatmap from "../components/StockHeatmap";
import PortfolioAnalytics from "../components/PortfolioAnalytics";

function Dashboard() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const refreshData = () => {
    fetchPortfolioSummary().then(setData);
    fetchTransactions(5, 0).then(setTransactions);
  };
  // Fetch data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  if (!data) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TopBar
        email={getEmail() || "user@example.com"}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDark={isDark}
        refreshData={refreshData} // This is the key!
      />

      <div className="p-6 text-black dark:text-white">
        {/*portfolio summary*/}
        <PortfolioSummary data={data} />

        {/* portfolio analytics donut chart */}
        <PortfolioAnalytics holdings={data.holdings} />

        {/* indian stock heatmap */}
        <StockHeatmap isDark={isDark} />

        {/* market overview widget*/}
        <MarketOverviewWidget isDark={isDark} />
      </div>
    </div>
  );
}

export default Dashboard;
