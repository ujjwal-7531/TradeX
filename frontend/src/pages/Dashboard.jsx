import { useEffect, useState } from "react";
import { fetchPortfolioSummary } from "../api/portfolio";
import PortfolioSummary from "../components/PortfolioSummary";
import HoldingsTable from "../components/HoldingsTable";
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../api/transactions";
import TransactionsTable from "../components/TransactionsTable";


function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchPortfolioSummary().then(setData);
    fetchTransactions(10, 0).then(setTransactions);
  }, []);

  useEffect(() => {
    fetchPortfolioSummary().then(setData);
  }, []);

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

      <HoldingsTable holdings={data.holdings} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}

export default Dashboard;
