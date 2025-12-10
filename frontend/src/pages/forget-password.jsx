import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your registered email");

    setLoading(true);
    try {
      const res = await fetch(api().forgetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.status) {
        toast.success(data.message || "OTP sent to your email");
        localStorage.setItem("resetEmail", data.email || email);
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-purple-200 relative overflow-hidden">
      {/* Background glowing circles */}
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-60 h-60 bg-indigo-300 opacity-30 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-2xl border border-white/40 shadow-xl rounded-3xl p-10">
        <h2 className="text-3xl font-bold text-indigo-700 text-center mb-3 drop-shadow-sm">
          Forgot Password
        </h2>
        <p className="text-center text-slate-600 mb-6 text-sm">
          Enter your registered email to receive an OTP.
        </p>

        {/* FORM AREA */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-300 placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform hover:scale-[1.02]"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <div className="space-y-5 text-center">
            <p className="text-green-600 text-sm font-medium">
              OTP has been sent to your email.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/otp-verification")}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 hover:shadow-xl transition-transform hover:scale-[1.02]"
              >
                Verify OTP
              </button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  localStorage.removeItem("resetEmail");
                }}
                className="flex-1 border border-slate-300 py-3 rounded-xl font-medium hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bottom link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
