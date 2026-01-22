import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          TradeX Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-700">
            Welcome to your dashboard 🚀
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Portfolio, trades, and watchlists will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
