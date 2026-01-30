import api from "./axios";

// Get a specific watchlist by ID
export const fetchWatchlist = (id) => api.get(`/watchlists/${id}`);

// Create a new watchlist (e.g., "Tech Stocks")
export const createWatchlist = (name) => api.post("/watchlists", { name });

// Add a stock to a watchlist
export const addStockToWatchlist = (watchlistId, symbol) => 
  api.post(`/watchlists/${watchlistId}/stocks`, { symbol });

// Remove a stock
export const removeStockFromWatchlist = (watchlistId, symbol) => 
  api.delete(`/watchlists/${watchlistId}/stocks/${symbol}`);