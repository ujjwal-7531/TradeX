import api from "./axios";

export const updateBalance = async (newBalanceValue) => {
  // We must match the schema keys exactly:
  const payload = {
    action: "CHANGE_CASH",      // From your schema
    new_balance: newBalanceValue, // The numeric value from the modal
    confirm: true,               // Assuming we want to confirm the change
    keyword: "string"            // Placeholder as per your schema
  };

  const response = await api.post("/settings/account", payload);
  return response.data;
};

export async function fetchPortfolioSummary() {
  const res = await api.get("/portfolio/summary");
  return res.data;
}
