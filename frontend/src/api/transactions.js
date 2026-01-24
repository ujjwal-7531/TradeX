import api from "./axios";

export async function fetchTransactions(limit = 10, offset = 0) {
  const res = await api.get(
    `/transactions?limit=${limit}&offset=${offset}`
  );
  return res.data;
}
