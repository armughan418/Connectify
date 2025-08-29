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
  const [error, setError] = useState("");

  function changeFullName(e) {
    setFullName(e.target.value);
  }
  function changeEmail(e) {
    setEmail(e.target.value);
  }
  function changePassword(e) {
    setPassword(e.target.value);
  }
  function changeConfirmPassword(e) {
    setConfirmPassword(e.target.value);
  }

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
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        const user = { name: fullName, email };
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Signup successful! Redirecting to login...");
        navigate("/login");
      } else {
        toast.error(data.message || "Signup failed!");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong. Please try again." || error.message);
    }
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          Create an Account
        </h2>

        {error && (
          <p className="bg-red-500 text-white text-sm p-2 rounded-md mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={changeFullName}
              className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={changeEmail}
              className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={changePassword}
              className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={changeConfirmPassword}
              className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="flex justify-center mt-4 text-sm">
          <p className="text-pink-200">
            Already have an account?{" "}
            <button
              className="text-white font-semibold hover:underline"
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

export default Signup;
