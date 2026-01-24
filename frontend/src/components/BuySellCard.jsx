import { useState } from "react";
import api from "../api/axios";

function BuySellCard({ type, onSuccess }) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isBuy = type === "BUY";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post(`/trade/${isBuy ? "buy" : "sell"}`, {
        symbol: symbol.toUpperCase(),
        quantity: Number(quantity),
      });

      setSymbol("");
      setQuantity("");
      onSuccess?.();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Trade failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-5">
      <h3
        className={`text-lg font-semibold mb-4 ${
          isBuy ? "text-green-600" : "text-red-600"
        }`}
      >
        {isBuy ? "Buy Stock" : "Sell Stock"}
      </h3>

      {error && (
        <p className="text-red-500 text-sm mb-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Symbol (e.g. TCS)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
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
