import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const changeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(api().forgetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your Email");
        setTimeout(() => {
          navigate("/otp-verification", { state: { email } });
        }, 1000);
      } else {
        toast.error(`${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      toast.error("Server error, try again later.");
    } finally {
      setLoading(false);
    }
    setEmail("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      {/* Gradient Box with Shadow */}
      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
          Forgot Password
        </h2>

        <p className="text-white/90 mb-6">
          Enter your registered email to reset your password
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={changeEmail}
            placeholder="Enter your email"
            className="w-full px-4 py-3 mb-6 rounded-lg bg-white/30 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-700 font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>

        {message && <p className="text-white mt-4 font-medium">{message}</p>}

        <div className="flex justify-center mt-4 text-sm">
          <p className="text-white/80">
            Remember your password?{" "}
            <button
              className="font-semibold hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
