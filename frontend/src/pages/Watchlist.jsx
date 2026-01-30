import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import { fetchAllWatchlists, fetchWatchlistDetail, createWatchlist, deleteWatchlist, removeStockFromWatchlist } from "../api/watchlists";

function WatchlistPage() {
  const [watchlists, setWatchlists] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentWatchlist, setCurrentWatchlist] = useState(null);
  const [newListName, setNewListName] = useState("");

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

  // Load specific stocks when selection changes
  const loadDetail = async () => {
    if (!selectedId) return;
    const data = await fetchWatchlistDetail(selectedId);
    setCurrentWatchlist(data);
  };

  useEffect(() => { loadSidebar(); }, []);
  useEffect(() => { loadDetail(); }, [selectedId]);

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
    await removeStockFromWatchlist(selectedId, symbol);
    loadDetail();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Watchlist Management */}
<div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col p-4">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-bold text-gray-800 dark:text-white">My Watchlists</h2>
    <span className="text-xs text-gray-400">{watchlists.length}/10</span>
  </div>
  
  {/* CREATE SECTION */}
  <div className="mb-6 space-y-2">
    <div className="flex gap-2">
      <input 
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate(e)} // Still works on Enter
        placeholder="Name (e.g. Tech)"
        className="flex-1 text-sm p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button 
        onClick={handleCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-lg font-bold transition-colors"
        title="Create Watchlist"
      >
        +
      </button>
    </div>
    {watchlists.length >= 10 && (
      <p className="text-[10px] text-red-500 italic">Limit of 10 reached</p>
    )}
  </div>

  <div className="flex-1 space-y-1 overflow-y-auto">
    {watchlists.length === 0 ? (
      <p className="text-sm text-gray-400 italic text-center mt-4">No watchlists yet</p>
    ) : (
      watchlists.map(list => (
        <div 
          key={list.id}
          onClick={() => setSelectedId(list.id)}
          className={`flex justify-between items-center p-2 rounded cursor-pointer group transition-all ${
            selectedId === list.id 
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 border-l-4 border-blue-600' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <span className="truncate font-medium">{list.name}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id); }}
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
        <div className="flex-1 p-8 overflow-y-auto">
          {currentWatchlist ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentWatchlist.watchlist}</h1>
                {/* Search Bar Component will go here */}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Price</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {currentWatchlist.stocks.map(stock => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600">{stock.symbol}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{stock.name}</td>
                        <td className="px-6 py-4 text-right font-mono font-semibold">₹{stock.price}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleRemoveStock(stock.symbol)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select or create a watchlist to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchlistPage;