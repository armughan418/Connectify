// src/pages/ForgetPassword.jsx
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
    <div className="flex h-screen bg-orange-50">
      <div className="m-auto max-w-md w-full p-6">
        <div className="bg-white rounded-2xl shadow p-8 border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter your registered email to receive an OTP.
          </p>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-orange-200 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-2 rounded-lg"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-green-600">OTP sent to your email.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/otp-verification")}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg"
                >
                  Verify OTP
                </button>
                <button
                  onClick={() => {
                    setOtpSent(false);
                    localStorage.removeItem("resetEmail");
                  }}
                  className="flex-1 border border-gray-300 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            Remembered?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-orange-600 underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForgetPassword;
