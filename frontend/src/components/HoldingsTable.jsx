import { useState, useEffect } from "react";
import Sparkline from "./Sparkline";

function HoldingsTable({ holdings, trends, onAction }) {
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-menu-container')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6 text-center">
        <div className="text-4xl mb-3">💼</div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">You do not own any stocks yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Start trading to build your portfolio!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6 overflow-visible w-full min-h-[300px] mb-32">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Your Holdings</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse text-left whitespace-nowrap">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-left border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider rounded-tl-2xl">Symbol</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Qty</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Avg Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Current Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Invested</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">Current Value</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">P&L</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center">7D Trend</th>
              <th className="px-6 py-4 rounded-tr-2xl"></th>
            </tr>
          </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {holdings.map((h) => {
            const isPositive = h.unrealized_pnl >= 0;
            const pnlColor = isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400";
            const pnlBg = isPositive ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-rose-50 dark:bg-rose-500/10";
            const pnlChevron = isPositive ? "▲" : "▼";

            return (
              <tr key={h.symbol} className="border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
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
                <td className="px-6 py-4 text-right relative action-menu-container">
                  <button
                    onClick={() => setOpenMenu(openMenu === h.symbol ? null : h.symbol)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Actions"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                  </button>

                  {openMenu === h.symbol && (
                    <div className="absolute right-0 mt-2 w-36 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden text-left animate-in fade-in slide-in-from-top-2 text-left">
                      <button
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors"
                        onClick={() => {
                          onAction(h.symbol, "BUY");
                          setOpenMenu(null);
                        }}
                      >
                        Buy
                      </button>

                      <button
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors"
                        onClick={() => {
                          onAction(h.symbol, "SELL");
                          setOpenMenu(null);
                        }}
                      >
                        Sell
                      </button>

                      <button
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors"
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
