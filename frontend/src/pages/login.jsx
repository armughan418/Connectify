import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Input fields cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(api().loginUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      if (result?.status) {
        toast.success(result.message);
        if (result.token) {
          localStorage.setItem("authToken", result.token);
        }
        navigate("/home");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Server error, try again later.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      {/* Gradient Box with Shadow */}
      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
          Welcome to Login
        </h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-white/30 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition"
          value={email}
          onChange={changeEmail}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 mb-6 rounded-lg bg-white/30 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition"
          value={password}
          onChange={changePassword}
        />

        {/* Login Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-white text-purple-700 font-semibold py-3 rounded-lg shadow hover:scale-105 transition-transform duration-200 mb-4"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Extra Options */}
        <div className="flex justify-between text-sm">
          <button
            type="button"
            className="text-white/80 hover:text-white font-medium transition"
            onClick={() => navigate("/signup")}
          >
            Create new Account
          </button>
          <button
            type="button"
            className="text-white/80 hover:text-white font-medium transition"
            onClick={() => navigate("/forget-password")}
          >
            Forget Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
