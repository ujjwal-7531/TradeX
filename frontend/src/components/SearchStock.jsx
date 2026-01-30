import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function StockSearch({ watchlistId, onStockAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Logic (Debounced to prevent server spam)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        try {
          // Adjust this URL to match your backend search route
          const res = await api.get(`/stocks/search?q=${query}`);
          setResults(res.data);
          setIsOpen(true);
        } catch (err) {
          console.error("Search failed", err);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = async (symbol) => {
    try {
      await api.post(`/watchlists/${watchlistId}/stocks`, { symbol });
      setQuery("");
      setIsOpen(false);
      onStockAdded(); // Triggers loadWatchlistDetails in the parent
    } catch (err) {
      alert(err.response?.data?.detail || "Error adding stock");
    }
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <input
        type="text"
        placeholder="🔍 Search stocks..."
        className="w-full p-2 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value.toUpperCase())}
      />

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {results.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol)}
              className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer border-b dark:border-gray-700 last:border-0"
            >
              <div className="font-bold text-blue-600 dark:text-blue-400">{stock.symbol}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{stock.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StockSearch;