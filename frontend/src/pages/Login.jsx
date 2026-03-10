import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setToken, setEmail as setAuthEmail, setFullName, setProfilePicture } from "../utils/auth";
import toast from "react-hot-toast";
import tradingBg from "../assets/bg.jpg";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setToken(res.data.access_token);
      setAuthEmail(res.data.email);
      setFullName(res.data.full_name);
      setProfilePicture(res.data.profile_picture_url);
      toast.success("Welcome back!");
      navigate("/dashboard"); 
    } catch (err) {
      if (err.response?.data?.detail === "Email not verified") {
        toast.error("Please verify your email first.");
      } else {
        toast.error("Invalid email or password");
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
      <h1 className="text-3xl font-extrabold text-center mb-2 text-white tracking-tight">
        Welcome Back
      </h1>
      <p className="text-blue-200 text-center mb-8 text-sm">
        Enter your credentials to access the terminal
      </p>

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
            Password
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
          {loading ? "Processing..." : "Sign In"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-sm text-gray-300">
          New to the platform?
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors"
          >
            Create an account
          </button>
        </p>
        <p className="text-sm text-gray-300 mt-2">
          Forgot to verify your email?
          <button
            onClick={() => {
              if (email) {
                navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
              } else {
                toast.error("Please enter your email above first.");
              }
            }}
            className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
          >
            Verify Now
          </button>
        </p>
      </div>
    </div>
  </div>
);
}

export default Login;
