function TransactionsTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm mt-6 text-center border border-gray-100 dark:border-gray-700">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          No transactions yet.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">When you buy or sell stocks, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden w-full border border-gray-100 dark:border-gray-700">
      {/* Hide the inner header if rendered inside the Transactions page, as the page already has a header */}
      {/* <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h3>
      </div> */}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse text-left whitespace-nowrap">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-left border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Quantity</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Execution Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Total Value</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Date & Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {transactions.map((tx) => {
              const isBuy = tx.trade_type === "BUY";
              const typeColor = isBuy ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400";
              const typeBg = isBuy ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-rose-100 dark:bg-rose-500/20";
              const typeIcon = isBuy ? "↙" : "↗";
              const totalValue = tx.quantity * tx.price;

              return (
                <tr key={tx.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${typeColor} ${typeBg}`}>
                      {typeIcon} {tx.trade_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                    {tx.symbol}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 dark:text-gray-300 font-medium">
                    {tx.quantity} <span className="text-gray-400 dark:text-gray-500 font-normal text-xs ml-1">shares</span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100 font-mono font-medium">
                    ₹{tx.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100 font-mono font-bold">
                    ₹{totalValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {new Date(tx.created_at).toLocaleString("en-IN", { 
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsTable;
