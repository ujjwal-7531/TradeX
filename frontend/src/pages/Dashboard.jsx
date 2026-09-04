import { useEffect, useState } from "react";

import { fetchPortfolioSummary } from "../api/portfolio";
import PortfolioSummary from "../components/PortfolioSummary";

import { removeToken, getEmail } from "../utils/auth";
import { useNavigate } from "react-router-dom";

import TopBar from "../components/TopBar";
import MarketOverviewWidget from "../components/MarketOverviewWidget";
import StockHeatmap from "../components/StockHeatmap";
import PortfolioAnalytics from "../components/PortfolioAnalytics";

import { toggleTheme as toggleAppTheme, getTheme } from "../utils/theme";

function Dashboard() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(getTheme() === "dark");

  const toggleTheme = () => {
    const next = toggleAppTheme();
    setIsDark(next === "dark");
  };

  const [data, setData] = useState(null);

  const refreshData = () => {
    fetchPortfolioSummary().then(setData);
  };

  useEffect(() => {
    refreshData();
    const intervalId = setInterval(refreshData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TopBar
        email={getEmail() || "user@example.com"}
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDark={isDark}
        refreshData={refreshData}
      />

      <div className="p-6 text-black dark:text-white">
        <PortfolioSummary data={data} />
        <PortfolioAnalytics holdings={data?.holdings} />
        <MarketOverviewWidget isDark={isDark} />
        <StockHeatmap isDark={isDark} />
      </div>
    </div>
  );
}

export default Dashboard;
