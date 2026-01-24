import api from "./axios";

export async function fetchPortfolioSummary() {
  const res = await api.get("/portfolio/summary");
  return res.data;
}
