import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.warning("Input fields cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(api().registerUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({ name: fullName, email }));
        toast.success("Signup successful! Redirecting to login...");
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }

    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      {/* Gradient Box with Shadow */}
      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-white mb-6 drop-shadow-lg">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg bg-white/30 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg bg-white/30 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg bg-white/30 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 mb-6 rounded-lg bg-white/30 border border-white/40 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-white text-purple-700 font-semibold py-3 rounded-lg shadow hover:scale-105 transition-transform duration-200 mb-4"
          >
            Sign Up
          </button>
        </form>

        <div className="flex justify-center mt-4 text-sm">
          <p className="text-white/80">
            Already have an account?{" "}
            <button
              className="font-semibold hover:underline"
              onClick={() => navigate("/")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
