import { useState } from "react";

function HoldingsTable({ holdings, onAction }) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow mt-6">
        <p className="text-gray-500 text-sm">
          You do not own any stocks yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow mt-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Your Holdings</h3>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-2">Symbol</th>
            <th className="pb-2">Qty</th>
            <th className="pb-2">Avg Price</th>
            <th className="pb-2">Current Price</th>
            <th className="pb-2">Invested</th>
            <th className="pb-2">Current Value</th>
            <th className="pb-2">P&L</th>
            <th className="pb-2"></th>

          </tr>
        </thead>

        <tbody>
          {holdings.map((h) => {
            const pnlColor =
              h.unrealized_pnl >= 0
                ? "text-green-600"
                : "text-red-600";

            return (
              <tr key={h.symbol} className="border-b last:border-b-0">
                <td className="py-2 font-medium">{h.symbol}</td>
                <td>{h.quantity}</td>
                <td>₹ {h.avg_price.toFixed(2)}</td>
                <td>₹ {h.current_price.toFixed(2)}</td>
                <td>₹ {h.invested_value.toFixed(2)}</td>
                <td>₹ {h.current_value.toFixed(2)}</td>
                <td className={pnlColor}>
                  ₹ {h.unrealized_pnl.toFixed(2)}
                </td>
                <td className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === h.symbol ? null : h.symbol)
                    }
                    className="px-2 py-1 hover:bg-gray-200 rounded"
                  >
                    ⋮
                  </button>

                  {openMenu === h.symbol && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-10">
                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          onAction(h.symbol, "BUY");
                          setOpenMenu(null);
                        }}
                      >
                      Buy
                      </button>

                      <button
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          onAction(h.symbol, "SELL");
                          setOpenMenu(null);
                        }}
                      >
                      Sell
                    </button>
                    
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        console.log("VIEW CHART", h.symbol);
                        setOpenMenu(null);
                      }}
                    >
                    View Chart
                    </button>

                    </div>
                  )}
                </td>
              </tr>
              
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HoldingsTable;
