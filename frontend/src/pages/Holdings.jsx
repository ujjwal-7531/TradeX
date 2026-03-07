import { useEffect, useState } from "react";
import { fetchPortfolioSummary, fetchStockTrends } from "../api/portfolio";
import PortfolioSummary from "../components/PortfolioSummary";
import HoldingsTable from "../components/HoldingsTable";
import { HoldingsTableSkeleton } from "../components/Skeletons";
import TopBar from "../components/TopBar";
import BuySellCard from "../components/BuySellCard";
import TradingViewChart from "../components/TradingViewChart";
import { removeToken, getEmail } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Holdings() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [trends, setTrends] = useState({});
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
    fetchPortfolioSummary().then(res => {
      setData(res);
      if (res && res.holdings && res.holdings.length > 0) {
        const symbols = res.holdings.map(h => h.symbol);
        fetchStockTrends(symbols).then(setTrends).catch(console.error);
      }
    });
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <TopBar email={getEmail() || "user@example.com"} onLogout={() => { removeToken(); navigate("/login"); }} onToggleTheme={toggleTheme} isDark={isDark} />
      
      <div className="p-6 text-black dark:text-white flex flex-col gap-6">
        <PortfolioSummary data={data} />
        {chartSymbol && <TradingViewChart symbol={chartSymbol} onClose={() => setChartSymbol(null)} />}
        
        {tradeOpen && (
          <BuySellCard 
            type={tradeType} 
            symbol={tradeSymbol} 
            onClose={() => setTradeOpen(false)} 
            onSuccess={() => { setTradeOpen(false); loadData(); }} 
          />
        )}

        {!data ? (
          <HoldingsTableSkeleton />
        ) : (
          <HoldingsTable holdings={data.holdings} trends={trends} onAction={handleAction} />
        )}
      </div>
    </div>
  );
}

export default Holdings;