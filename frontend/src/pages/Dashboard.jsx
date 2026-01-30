import { useEffect, useState } from "react";

import { fetchPortfolioSummary } from "../api/portfolio";
import PortfolioSummary from "../components/PortfolioSummary";

import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../api/transactions";
import TransactionsTable from "../components/TransactionsTable";
import BuySellCard from "../components/BuySellCard";
import TradingViewChart from "../components/TradingViewChart";
import TopBar from "../components/TopBar";
import MarketOverviewWidget from "../components/MarketOverviewWidget"; //for market overview widget



function Dashboard() {
  const navigate = useNavigate();
  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeType, setTradeType] = useState(null); // "BUY" | "SELL"
  const [tradeSymbol, setTradeSymbol] = useState("");

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    fetchPortfolioSummary().then(setData);
    // Only fetch a small preview (last 5) for the dashboard
    fetchTransactions(5, 0).then(setTransactions);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };


  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const refreshData = () => {
    fetchPortfolioSummary().then(setData);
    fetchTransactions(10, 0).then(setTransactions);
  };

  // 2. SINGLE EFFECT ON MOUNT
  useEffect(() => {
    refreshData();
  }, []);

  // buy sell wiring
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedTradeType, setSelectedTradeType] = useState(null);

  const handleHoldingAction = (symbol, type) => {
    if (type === "BUY" || type === "SELL") {
      setTradeSymbol(symbol);
      setTradeType(type);
      setTradeOpen(true);
    }

    if (type === "CHART") {
      setChartSymbol(symbol);
    }
  };

  // chart 
  const [chartSymbol, setChartSymbol] = useState(null);


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
        email="user@example.com" // You can replace this with real user data later
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDark={isDark}
        refreshData={refreshData} // This is the key!
      />


      <div className="p-6 text-black dark:text-white">
        {/*portfolio summary*/}
        <PortfolioSummary data={data} />

        {/* market overview widget*/}
        <MarketOverviewWidget isDark={isDark} />


        {chartSymbol && (
          <TradingViewChart
            symbol={chartSymbol}
            onClose={() => setChartSymbol(null)}
          />
        )}
        {tradeOpen && (
          <BuySellCard
            type={tradeType}
            symbol={tradeSymbol}
            onClose={() => setTradeOpen(false)}
            onSuccess={() => {
              setTradeOpen(false);
              refreshData();
            }}
          />
        )}
      </div>
    </div>
  );


}

export default Dashboard;
