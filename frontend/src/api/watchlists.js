import api from "./axios";

// export const fetchAllWatchlists = () => api.get("/watchlists");
// export const fetchWatchlist = (id) => api.get(`/watchlists/${id}`);
// export const createWatchlist = (name) => api.post("/watchlists", { name });

// // Updated to match your specific search route
// export const searchStocks = (query) => api.get(`/watchlists/search/stocks?q=${query}`);

// // Matches your @router.post("/{watchlist_id}/stocks")
// export const addStockToWatchlist = (watchlistId, symbol) => 
//   api.post(`/watchlists/${watchlistId}/stocks`, { symbol });

// export const removeStockFromWatchlist = (watchlistId, symbol) => 
//   api.delete(`/watchlists/${watchlistId}/stocks/${symbol}`);

// // Add this to your src/api/watchlists.js
// export const deleteWatchlist = (id) => api.delete(`/watchlists/${id}`);


export const fetchAllWatchlists = async () => {
  const res = await api.get("/watchlists");
  return res.data;
};

// Create a new watchlist (limit check is handled by backend)
// src/api/watchlists.js
// src/api/watchlists.js

// WRONG: api.post("/watchlists", name) -> Sends a raw string
// RIGHT: api.post("/watchlists", { name }) -> Sends {"name": "..."}
// src/api/watchlists.js
// Change this:
export const createWatchlist = async (name) => {
  // 1. Added a trailing slash to match FastAPI's strict routing
  // 2. Used the full object mapping for clarity
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
  const res = await api.post(`/watchlists/${watchlistId}/stocks`, { symbol });
  return res.data;
};

// Remove stock from a watchlist
export const removeStockFromWatchlist = async (watchlistId, symbol) => {
  const res = await api.delete(`/watchlists/${watchlistId}/stocks/${symbol}`);
  return res.data;
};