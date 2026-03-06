import { useState } from "react";
import Sparkline from "./Sparkline";

function HoldingsTable({ holdings, trends, onAction }) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white p-6 rounded shadow mt-6">
        <p className="text-gray-500 text-sm">You do not own any stocks yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6 overflow-visible w-full min-h-[300px] mb-32">
      <h3 className="text-lg font-semibold mb-4">Your Holdings</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 rounded-tl-lg">Symbol</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4 text-right">Avg Price</th>
              <th className="px-6 py-4 text-right">Current Price</th>
              <th className="px-6 py-4 text-right">Invested</th>
              <th className="px-6 py-4 text-right">Current Value</th>
              <th className="px-6 py-4 text-right">P&L</th>
              <th className="px-6 py-4 text-center">7D Trend</th>
              <th className="px-6 py-4 rounded-tr-lg"></th>
            </tr>
          </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {holdings.map((h) => {
            const isPositive = h.unrealized_pnl >= 0;
            const pnlColor = isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
            const pnlBg = isPositive ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-rose-50 dark:bg-rose-500/10";
            const pnlChevron = isPositive ? "▲" : "▼";

            return (
              <tr key={h.symbol} className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                  {h.symbol}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                  {h.quantity}
                </td>
                <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400 font-mono">
                  ₹{h.avg_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100 font-mono font-medium">
                  ₹{h.current_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400 font-mono">
                  ₹{h.invested_value.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100 font-mono font-semibold">
                  ₹{h.current_value.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono font-medium text-sm ${pnlColor} ${pnlBg}`}>
                      <span className="text-[10px]">{pnlChevron}</span>
                      <span>₹{Math.abs(h.unrealized_pnl).toFixed(2)}</span>
                      <span className="opacity-75 relative -top-[1px]">({h.pnl_percent}%)</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 flex justify-center">
                  <Sparkline data={trends?.[h.symbol] || []} />
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === h.symbol ? null : h.symbol)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Actions"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                  </button>

                  {openMenu === h.symbol && (
                    <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-10">
                      <button
                        className="
    block w-full text-left px-3 py-2 text-sm
    text-gray-800 dark:text-gray-200
    hover:bg-gray-100 dark:hover:bg-gray-700
  "
                        onClick={() => {
                          onAction(h.symbol, "BUY");
                          setOpenMenu(null);
                        }}
                      >
                        Buy
                      </button>

                      <button
                        className="
    block w-full text-left px-3 py-2 text-sm
    text-gray-800 dark:text-gray-200
    hover:bg-gray-100 dark:hover:bg-gray-700
  "
                        onClick={() => {
                          onAction(h.symbol, "SELL");
                          setOpenMenu(null);
                        }}
                      >
                        Sell
                      </button>

                      <button
                        className="
    block w-full text-left px-3 py-2 text-sm
    text-gray-800 dark:text-gray-200
    hover:bg-gray-100 dark:hover:bg-gray-700
  "
                        onClick={() => {
                          onAction(h.symbol, "CHART");
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
    </div>
  );
}

export default HoldingsTable;
