import { useEffect, useState } from "react";
import { fetchPortfolioSummary } from "../api/portfolio";
import HoldingsTable from "../components/HoldingsTable";
import TopBar from "../components/TopBar";
import BuySellCard from "../components/BuySellCard";
import TradingViewChart from "../components/TradingViewChart";
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Holdings() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeType, setTradeType] = useState(null);
  const [tradeSymbol, setTradeSymbol] = useState("");
  const [chartSymbol, setChartSymbol] = useState(null);

  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const loadData = () => {
    fetchPortfolioSummary().then(setData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = (symbol, type) => {
    if (type === "BUY" || type === "SELL") {
      setTradeSymbol(symbol);
      setTradeType(type);
      setTradeOpen(true);
    } else if (type === "CHART") {
      setChartSymbol(symbol);
    }
  };

  if (!data) return <p className="p-6 text-gray-500">Loading holdings...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TopBar email="user@example.com" onLogout={() => { removeToken(); navigate("/login"); }} onToggleTheme={toggleTheme} isDark={isDark} />
      
      <div className="p-6 text-black dark:text-white">
        <h2 className="text-2xl font-bold mb-4">My Portfolio Holdings</h2>
        
        {chartSymbol && <TradingViewChart symbol={chartSymbol} onClose={() => setChartSymbol(null)} />}
        
        {tradeOpen && (
          <BuySellCard 
            type={tradeType} 
            symbol={tradeSymbol} 
            onClose={() => setTradeOpen(false)} 
            onSuccess={() => { setTradeOpen(false); loadData(); }} 
          />
        )}

        <HoldingsTable holdings={data.holdings} onAction={handleAction} />
      </div>
    </div>
  );
}

export default Holdings;