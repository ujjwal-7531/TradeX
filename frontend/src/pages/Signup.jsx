import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import tradingBg from "../assets/bg.jpg";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/signup", {
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
  <div 
    className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
    style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${tradingBg})` 
    }}
  >
    {/* Glassmorphism Card */}
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 m-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Create Account</h1>
        <p className="text-blue-200 text-sm">Join the community and start tracking your portfolio</p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-200 bg-red-900/50 border border-red-500/50 p-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1 ml-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1 ml-1">
            Create Password
          </label>
          <input
            type="password"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 mt-4"
        >
          {loading ? "Creating Terminal..." : "Register Now"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-sm text-gray-300">
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
          >
            Log in here
          </button>
        </p>
      </div>
    </div>
  </div>
);
}

export default Signup;
