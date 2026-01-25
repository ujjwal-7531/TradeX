function TransactionsTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow mt-6">
        <p className="text-gray-500 text-sm">
          No transactions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mt-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">
        Recent Transactions
      </h3>

      <table className="w-full text-sm border-collapse text-black dark:text-gray-200">
        <thead>
          <tr className="text-left border-b border-gray-200 dark:border-gray-700">
            <th className="pb-2">Type</th>
            <th className="pb-2">Symbol</th>
            <th className="pb-2">Qty</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Time</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => {
            const typeColor =
              tx.trade_type === "BUY"
                ? "text-green-600"
                : "text-red-600";

            return (
              <tr key={tx.id} className="border-b last:border-b-0">
                <td className={`py-2 font-medium ${typeColor}`}>
                  {tx.trade_type}
                </td>
                <td>{tx.symbol}</td>
                <td>{tx.quantity}</td>
                <td>₹ {tx.price.toFixed(2)}</td>
                <td className="text-gray-500">
                  {new Date(tx.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;
