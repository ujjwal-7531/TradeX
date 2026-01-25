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



function Dashboard() {
  const navigate = useNavigate();

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
      setSelectedSymbol(symbol);
      setSelectedTradeType(type);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600"
        >
          Logout
        </button>
      </div>

      <PortfolioSummary />

      {/* Buy / Sell */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <BuySellCard
          type="BUY"
          active={selectedTradeType === "BUY"}
          presetSymbol={selectedSymbol}
          onSuccess={refreshData}
        />

        <BuySellCard
          type="SELL"
          active={selectedTradeType === "SELL"}
          presetSymbol={selectedSymbol}
          onSuccess={refreshData}
        />
      </div>

      {chartSymbol && (
        <TradingViewChart
          symbol={chartSymbol}
          onClose={() => setChartSymbol(null)}
        />
      )}

      <HoldingsTable
        holdings={data.holdings}
        onAction={handleHoldingAction}
      />

      <TransactionsTable transactions={transactions} />
    </div>
  );
}

export default Dashboard;
