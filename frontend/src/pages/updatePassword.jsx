import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function UpdatePassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const token =
    location.state?.token || localStorage.getItem("resetToken") || "";
  const email =
    location.state?.email || localStorage.getItem("resetEmail") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(api().updatePassword, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        localStorage.removeItem("resetToken");
        localStorage.removeItem("resetEmail");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(`${data.message || "Failed to update password"}`);
      }
    } catch (error) {
      toast.error("Server error, please try again later." || error.message);
    }
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/30">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          Reset Password
        </h2>
        <p className="text-center text-pink-100 mb-6">
          Set a new password for <b>{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/40 text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            Update Password
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-white font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;
