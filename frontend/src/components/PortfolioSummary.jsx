import { useEffect, useState } from "react";
import { fetchPortfolioSummary } from "../api/portfolio";

function StatCard({ title, value, valueClass = "" }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-xl font-semibold mt-1 ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

function PortfolioSummary() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPortfolioSummary()
      .then(setData)
      .catch(() => setError("Failed to load portfolio summary"));
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="text-gray-500">Loading portfolio...</p>;
  }

  const pnlColor =data.total_unrealized_pnl >= 0 ? "text-green-600" : "text-red-600";
  const pnl_percentage = data.total_invested > 0 ? ((data.total_unrealized_pnl * 100) / data.total_invested).toFixed(2) : 0.00

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Cash Balance"
        value={`₹ ${data.cash_balance.toFixed(2)}`}
      />

      <StatCard
        title="Invested Amount"
        value={`₹ ${data.total_invested.toFixed(2)}`}
      />

      <StatCard
        title="Current Value"
        value={`₹ ${data.current_value.toFixed(2)}`}
      />

      <StatCard
        title="Net P&L"
        value={`₹ ${data.total_unrealized_pnl.toFixed(2)} (${pnl_percentage}%)`}
        valueClass={pnlColor}
      />
    </div>
  );
}

export default PortfolioSummary;
