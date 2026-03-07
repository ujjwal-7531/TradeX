import api from "./axios";

export const fetchAllWatchlists = async () => {
  const res = await api.get("/watchlists");
  return res.data;
};

export const createWatchlist = async (name) => {
  const res = await api.post("/watchlists/", { name: name }); 
  return res.data;
};

// Delete an entire watchlist
export const deleteWatchlist = async (id) => {
  const res = await api.delete(`/watchlists/${id}`);
  return res.data;
};

// Get stocks for a specific watchlist
export const fetchWatchlistDetail = async (id) => {
  const res = await api.get(`/watchlists/${id}`);
  return res.data;
};

// Search stocks alphabetically (from our new stocks.py)
export const searchStocks = async (query) => {
  const res = await api.get(`/stocks/search?q=${query}`);
  return res.data;
};

// Add stock to a specific watchlist
export const addStockToWatchlist = async (watchlistId, symbol) => {
  // Matches the @router.post("/{watchlist_id}/stocks") we created
  const res = await api.post(`/watchlists/${watchlistId}/stocks`, { symbol });
  return res.data;
};

export const removeStockFromWatchlist = async (watchlistId, symbol) => {
  const res = await api.delete(`/watchlists/${watchlistId}/stocks/${symbol}`);
  return res.data;
};

export const fetchWatchlistById = async (id) => {
  const res = await api.get(`/watchlists/${id}`);
  return res.data;
};