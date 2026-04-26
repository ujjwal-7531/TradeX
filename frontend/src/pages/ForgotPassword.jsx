import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import tradingBg from "../assets/bg.jpg";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("If that email exists, an OTP has been sent!");
      setStep(2);
    } catch (err) {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { 
        email, 
        otp, 
        new_password: newPassword 
      });
      toast.success("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid OTP or failed reset.");
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
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 m-4 animate-in fade-in zoom-in-95 duration-300">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-white tracking-tight">
          {step === 1 ? "Reset Password" : "Enter New Password"}
        </h1>
        <p className="text-blue-200 text-center mb-8 text-sm">
          {step === 1 
            ? "Enter your email to receive a secure recovery code." 
            : "Enter the code we emailed you and your new password."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendResetEmail} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1 ml-1">
                Account Email
              </label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all shadow-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? "Sending..." : "Send Recovery Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1 ml-1">
                Recovery Code
              </label>
              <input
                type="text"
                maxLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-[0.5em] font-mono text-center text-xl transition-all shadow-sm"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1 ml-1 mt-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all shadow-sm"
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? "Resetting..." : "Confirm Password Reset"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
