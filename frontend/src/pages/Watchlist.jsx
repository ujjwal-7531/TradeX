import { useState, useEffect } from "react";
import { removeToken } from "../utils/auth";
import TopBar from "../components/TopBar";
import BuySellCard from "../components/BuySellCard";
import TradingViewChart from "../components/TradingViewChart";
import { fetchPortfolioSummary } from "../api/portfolio";
import { fetchTransactions} from "../api/transactions";
import {
  fetchAllWatchlists,
  fetchWatchlistDetail,
  createWatchlist,
  deleteWatchlist,
  removeStockFromWatchlist,
  fetchWatchlistById,
} from "../api/watchlists";
import StockSearch from "../components/SearchStock";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { fetchStockTrends } from "../api/portfolio";
import Sparkline from "../components/Sparkline";

function WatchlistPage() {
  const navigate = useNavigate();
  const [watchlists, setWatchlists] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentWatchlist, setCurrentWatchlist] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeType, setTradeType] = useState(null);
  const [tradeSymbol, setTradeSymbol] = useState("");
  const [chartSymbol, setChartSymbol] = useState(null);
  const [trends, setTrends] = useState({});

  const handleAction = (symbol, type) => {
    if (type === "BUY" || type === "SELL") {
      setTradeSymbol(symbol);
      setTradeType(type);
      setTradeOpen(true);
    } else if (type === "CHART") {
      setChartSymbol(symbol);
    }
  };

  // Load sidebar data
  const loadSidebar = async () => {
    try {
      const data = await fetchAllWatchlists();
      // Ensure we always set an array, even if data is null
      setWatchlists(Array.isArray(data) ? data : []);

      if (data?.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error("Sidebar Load Error:", err.response?.data);
      setWatchlists([]); // Fallback to empty list so the 'Create' form still shows
    }
  };

  const loadWatchlistDetails = async () => {
    if (!selectedId) return;
    try {
      const data = await fetchWatchlistById(selectedId);
      setCurrentWatchlist(data);

      if (data && data.stocks && data.stocks.length > 0) {
        const symbols = data.stocks.map(s => s.symbol);
        fetchStockTrends(symbols).then(setTrends).catch(console.error);
      }
    } catch (err) {
      console.error("Error loading stocks:", err);
    }
  };

  useEffect(() => {
    loadSidebar();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-menu-container')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Automatically load details when selectedId changes
  useEffect(() => {
    if (selectedId) {
      loadWatchlistDetails();
    } else {
      setCurrentWatchlist(null);
    }
  }, [selectedId]);

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    const trimmedName = newListName.trim();
    if (!trimmedName) return;

    try {
      await createWatchlist(trimmedName);
      setNewListName(""); // ONLY clear if successful
      await loadSidebar(); // Refresh the list
    } catch (err) {
      // This will alert you to the EXACT reason for the 422
      console.error("Validation Error:", err.response?.data);
      alert(`Error: ${JSON.stringify(err.response?.data?.detail)}`);
    }
  };

  const handleDeleteList = async (id) => {
    if (window.confirm("Delete this entire watchlist?")) {
      await deleteWatchlist(id);
      setSelectedId(null);
      loadSidebar();
    }
  };

  const handleRemoveStock = async (symbol) => {
    try {
      await api.delete(`/watchlists/${selectedId}/stocks/${symbol}`);
      // Refresh the table immediately after removal
      loadWatchlistDetails();
    } catch (err) {
      console.error("Failed to remove stock:", err);
      alert("Could not remove stock. Please try again.");
    }
  };
  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const refreshData = () => {
    // Only used to pass to TopBar, though fetchPortfolioSummary is unused in this UI
    fetchPortfolioSummary();
    fetchTransactions(10, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <TopBar
        email="user@example.com" // You can replace this with real user data later
        onLogout={handleLogout}
        onToggleTheme={toggleTheme}
        isDark={isDark}
        refreshData={refreshData} // This is the key!
      />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Watchlist Management */}
        <div className="w-64 bg-gray-50/50 dark:bg-gray-900/50 border-r border-gray-100 dark:border-gray-800 flex flex-col p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-extrabold text-gray-800 dark:text-white tracking-tight">
              My Watchlists
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {watchlists.length}/10
            </span>
          </div>

          {/* CREATE SECTION */}
          <div className="mb-6 space-y-2">
            <div className="flex gap-2">
              <input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate(e)} // Still works on Enter
                placeholder="Name (e.g. Tech)"
                className="flex-1 text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-sm"
              />
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-lg flex items-center justify-center text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Create Watchlist"
              >
                +
              </button>
            </div>
            {watchlists.length >= 10 && (
              <p className="text-[10px] text-red-500 font-medium">
                Limit of 10 reached
              </p>
            )}
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
            {watchlists.length === 0 ? (
              <p className="text-sm text-gray-400 italic text-center mt-8">
                No watchlists yet
              </p>
            ) : (
              watchlists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => setSelectedId(list.id)}
                  className={`flex justify-between items-center px-3 py-2.5 rounded-lg cursor-pointer group transition-all duration-200 ${
                    selectedId === list.id
                      ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-gray-700 shadow-sm font-semibold border-l-4 border-l-blue-600 dark:border-l-blue-500"
                      : "hover:bg-white dark:hover:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:shadow-sm border border-transparent"
                  }`}
                >
                  <span className="truncate font-medium">{list.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 px-1 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT CONTENT: Stock List */}
        <div className="flex-1 p-8 pb-32 overflow-y-auto">
          {chartSymbol && <TradingViewChart symbol={chartSymbol} onClose={() => setChartSymbol(null)} />}
          {tradeOpen && (
            <BuySellCard 
              type={tradeType} 
              symbol={tradeSymbol} 
              onClose={() => setTradeOpen(false)} 
              onSuccess={() => { setTradeOpen(false); refreshData(); }} 
            />
          )}

          {selectedId ? (
            <div>
              {/* Header Area */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {watchlists.find((w) => w.id === selectedId)?.name ||
                    "Watchlist"}
                </h1>

                {/* Search Component to add new stocks */}
                <StockSearch
                  watchlistId={selectedId}
                  onStockAdded={loadWatchlistDetails}
                />
              </div>

              {/* Stocks Table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-visible mt-2">
                <table className="w-full">
                  <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-left border-b border-gray-100 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider rounded-tl-2xl">
                        Symbol
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-right">
                        Price
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center">
                        7D Trend
                      </th>
                      <th className="px-6 py-4 rounded-tr-2xl"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {!currentWatchlist ||
                    currentWatchlist.stocks.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-16 text-center text-gray-400"
                        >
                          No stocks in this watchlist yet. Use the search bar to
                          add some!
                        </td>
                      </tr>
                    ) : (
                      currentWatchlist.stocks.map((stock) => (
                        <tr
                          key={stock.symbol}
                          // Remove hover:bg-gray-50 if it's causing issues, or strictly define both:
                          className="group transition-colors border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-blue-900/20"
                        >
                          <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                            {stock.symbol}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            {stock.name}
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-semibold dark:text-white">
                            ₹{stock.price}
                          </td>
                          <td className="px-6 py-4 flex justify-center">
                            <Sparkline data={trends?.[stock.symbol] || []} />
                          </td>
                          <td className="px-6 py-4 text-right relative action-menu-container">
                            <button
                              onClick={() => setOpenMenu(openMenu === stock.symbol ? null : stock.symbol)}
                              className="px-2 py-1 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              ⋮
                            </button>

                            {openMenu === stock.symbol && (
                              <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow z-10 text-left">
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => {
                                    handleAction(stock.symbol, "BUY");
                                    setOpenMenu(null);
                                  }}
                                >
                                  Buy
                                </button>
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => {
                                    handleAction(stock.symbol, "SELL");
                                    setOpenMenu(null);
                                  }}
                                >
                                  Sell
                                </button>
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onClick={() => {
                                    handleAction(stock.symbol, "CHART");
                                    setOpenMenu(null);
                                  }}
                                >
                                  View Chart
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <button
                                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  onClick={() => {
                                    handleRemoveStock(stock.symbol);
                                    setOpenMenu(null);
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Empty State when nothing is selected */
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-xl font-medium">
                Select a watchlist to get started
              </p>
              <p className="text-sm">Or create a new one in the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchlistPage;
