import { StatCardSkeleton } from "./Skeletons";

function StatCard({ title, value, valueClass = "" }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10">{title}</p>
      <p className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight mt-2 relative z-10 ${valueClass}`}>{value}</p>
    </div>
  );
}

function PortfolioSummary({ data }) {
  // Remove early return and fetch effect from here (lifted up)

  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const pnlColor =
    data.total_unrealized_pnl >= 0 ? "text-green-600" : "text-red-600";
  const pnl_percentage =
    data.total_invested > 0
      ? ((data.total_unrealized_pnl * 100) / data.total_invested).toFixed(2)
      : 0.0;

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
