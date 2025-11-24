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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(api().updatePassword, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        toast.success("Password updated successfully!");
        localStorage.removeItem("resetToken");
        localStorage.removeItem("resetEmail");

        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error(error.message || "Server error, please try again later.");
    } finally {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex h-screen bg-orange-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border-l-4 border-orange-500">
          <h2 className="text-3xl font-extrabold text-orange-600 mb-4">
            Reset Password
          </h2>
          <p className="text-slate-500 mb-6">
            Set a new password for <b>{email}</b>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-600 text-white font-semibold py-3 rounded-lg shadow transition hover:bg-orange-700 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-4 text-gray-500 text-sm">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-orange-500 font-medium hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UpdatePassword;
