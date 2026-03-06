import { useState, useEffect } from "react";
import api from "../api/axios";

function BuySellCard({ type, symbol, onClose, onSuccess }) {
  const isBuy = type === "BUY";

  // 🔹 local state
  const [inputSymbol, setInputSymbol] = useState(symbol || "");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 auto-fill symbol when user clicks Buy/Sell from holdings
  useEffect(() => {
    if (symbol) {
      setInputSymbol(symbol);
    }
  }, [symbol]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post(`/trade/${isBuy ? "buy" : "sell"}`, {
        symbol: inputSymbol.toUpperCase(),
        quantity: Number(quantity),
      });

      setQuantity("");
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.detail || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative w-full max-w-md overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Header Gradient */}
        <div className={`h-2 w-full ${isBuy ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-rose-600'}`}></div>
        
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isBuy ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></span>
              {isBuy ? "Buy Order" : "Sell Order"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-start gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Stock Symbol</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. RELIANCE"
                  value={inputSymbol}
                  onChange={(e) => setInputSymbol(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg rounded-xl px-4 py-3 focus:ring-2 focus:border-transparent outline-none transition-all uppercase placeholder:normal-case font-medium"
                  style={{
                    '--tw-ring-color': isBuy ? 'rgb(34 197 94 / 0.5)' : 'rgb(239 68 68 / 0.5)'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quantity</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg rounded-xl px-4 py-3 focus:ring-2 focus:border-transparent outline-none transition-all font-mono"
                  style={{
                    '--tw-ring-color': isBuy ? 'rgb(34 197 94 / 0.5)' : 'rgb(239 68 68 / 0.5)'
                  }}
                  min="1"
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 mt-2 rounded-xl text-white font-bold text-lg tracking-wide shadow-lg border-b-4 active:border-b-0 active:translate-y-[4px] transition-all flex items-center justify-center gap-2
                ${loading ? "opacity-75 cursor-not-allowed" : ""}
                ${isBuy 
                  ? "bg-green-500 hover:bg-green-400 border-green-600 shadow-green-500/30" 
                  : "bg-red-500 hover:bg-red-400 border-red-600 shadow-red-500/30"
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {isBuy ? "Execute Buy" : "Execute Sell"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BuySellCard;
