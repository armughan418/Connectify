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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          Welcome to Login
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={email}
            onChange={changeEmail}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={password}
            onChange={changePassword}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        {/* Extra Options */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            type="button"
            className="text-pink-200 hover:text-white transition"
            onClick={() => navigate("/signup")}
          >
            Create new Account
          </button>
          <button
            type="button"
            className="text-pink-200 hover:text-white transition"
            onClick={() => navigate("/forget-password")}
          >
            Forget Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
