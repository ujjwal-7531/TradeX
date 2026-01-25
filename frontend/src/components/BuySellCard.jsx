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
    <div
      className={`relative bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow p-5
        ${isBuy ? "ring-2 ring-green-500" : "ring-2 ring-red-500"}`}
    >
      {/* ❌ Close */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
      >
        ✕
      </button>

      <h3
        className={`text-lg font-semibold mb-4 ${
          isBuy ? "text-green-600" : "text-red-600"
        }`}
      >
        {isBuy ? "Buy Stock" : "Sell Stock"}
      </h3>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Symbol (e.g. TCS)"
          value={inputSymbol}
          onChange={(e) => setInputSymbol(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border rounded px-3 py-2"
          min="1"
          required
        />

        <button
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            isBuy
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : type}
        </button>
      </form>
    </div>
  );
}

export default BuySellCard;
