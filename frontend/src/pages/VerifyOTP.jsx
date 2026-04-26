import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import tradingBg from "../assets/bg.jpg";

function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Email can come from URL params (magic link) or from router state (redirect after signup)
  const initialEmail = searchParams.get("email") || location.state?.email || "";
  const initialOtp = searchParams.get("otp") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Timer countdown hook
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer <= 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // If both email and otp are present in the URL on mount, automatically verify.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (initialEmail && initialOtp) {
      handleVerify(initialEmail, initialOtp);
    }
  }, []);

  const handleVerify = async (verifyEmail, verifyOtp) => {
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email: verifyEmail,
        otp: verifyOtp,
      });
      toast.success("Email verified successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Verification failed. Please check your OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Please provide both email and OTP.");
      return;
    }
    handleVerify(email, otp);
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter an email address to resend the code.");
      return;
    }
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("A new OTP has been sent to your email.");
      setOtp(""); // Clear existing OTP input
      setResendTimer(60); // Reset the 60 second timer
    } catch (err) {
      if (err.response?.data?.detail) {
        toast.error(err.response.data.detail);
      } else {
        toast.error("Failed to resend OTP.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${tradingBg})` 
      }}
    >
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 m-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Verify Email</h1>
          <p className="text-blue-200 text-sm">We've sent a 6-digit code to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1 ml-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all cursor-not-allowed opacity-75"
              value={email}
              readOnly
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1 ml-1">
              6-Digit OTP
            </label>
            <input
              type="text"
              maxLength="6"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all text-center tracking-[0.5em] font-bold text-xl"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || resending}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResend}
            disabled={resending || loading || resendTimer > 0}
            className={`text-sm font-medium transition-colors ${
              resendTimer > 0 
                ? "text-gray-400 cursor-not-allowed" 
                : "text-blue-300 hover:text-blue-200"
            }`}
          >
            {resending 
              ? "Sending..." 
              : resendTimer > 0 
                ? `Resend OTP in ${resendTimer}s` 
                : "Didn't receive the code? Resend OTP"
            }
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
