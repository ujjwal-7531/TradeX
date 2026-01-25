import { useEffect, useState } from "react";
import { fetchPortfolioSummary } from "../api/portfolio";
import PortfolioSummary from "../components/PortfolioSummary";
import HoldingsTable from "../components/HoldingsTable";
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../api/transactions";
import TransactionsTable from "../components/TransactionsTable";
import BuySellCard from "../components/BuySellCard";
import TradingViewChart from "../components/TradingViewChart";
import TopBar from "../components/TopBar";



function Dashboard() {
  const navigate = useNavigate();
  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeType, setTradeType] = useState(null); // "BUY" | "SELL"
  const [tradeSymbol, setTradeSymbol] = useState("");

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };


  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    fetchPortfolioSummary().then(setData);
    fetchTransactions(10, 0).then(setTransactions);
  }, []);

  const refreshData = () => {
    fetchPortfolioSummary().then(setData);
    fetchTransactions(10, 0).then(setTransactions);
  };

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
        email="user@example.com"
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />


      <div className="p-6 text-black dark:text-white">
        <PortfolioSummary />
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
        <HoldingsTable
          holdings={data.holdings}
          onAction={handleHoldingAction}
        />

        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );


}

export default Dashboard;
