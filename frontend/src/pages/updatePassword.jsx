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

    const getPasswordMinLength = () => {
      const saved = localStorage.getItem("passwordMinLength");
      if (saved) {
        try {
          return parseInt(JSON.parse(saved)) || 6;
        } catch {
          return 6;
        }
      }
      return 6;
    };

    const getRequireStrongPassword = () => {
      const saved = localStorage.getItem("requireStrongPassword");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return false;
        }
      }
      return false;
    };

    const minLength = getPasswordMinLength();
    if (password.length < minLength) {
      toast.error(`Password must be at least ${minLength} characters long.`);
      return;
    }

    const requireStrong = getRequireStrongPassword();
    if (requireStrong) {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        toast.error(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)."
        );
        return;
      }
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
        body: JSON.stringify({ email, token, password }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-purple-200 relative overflow-hidden">
      <div className="absolute w-60 h-60 bg-indigo-300 opacity-30 rounded-full blur-3xl top-10 left-10" />
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl bottom-10 right-10" />

      <div className="relative z-10 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] max-w-md w-full p-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Reset Password
        </h2>
        <p className="text-slate-600 mb-6 text-sm">
          Set a new password for <b className="text-indigo-700">{email}</b>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm text-slate-800 placeholder-slate-400 backdrop-blur"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/70 border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm text-slate-800 placeholder-slate-400 backdrop-blur"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform duration-200 hover:scale-[1.02] disabled:opacity-50`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-4 text-slate-600 text-sm">
          Remembered your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-700 font-medium hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
