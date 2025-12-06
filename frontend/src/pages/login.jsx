import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ email, password, role }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      if (result.status) {
        toast.success(result.message);

        const token =
          result.token ||
          result.accessToken ||
          result.jwt ||
          result.data?.token ||
          result.data?.accessToken;

        if (token) {
          localStorage.setItem("token", token); // Store as "token" for consistency
          localStorage.setItem("authToken", token); // Also store as "authToken" for backward compatibility
        }

        if (result.user) {
          const userData = {
            _id: result.user.id || result.user._id,
            id: result.user.id || result.user._id,
            name: result.user.name || "",
            email: result.user.email || "",
            phone: result.user.phone || "",
            address: result.user.address || "",
            role: result.user.role || role,
            isAdmin: result.user.isAdmin || result.user.role === "admin",
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Login Error:", error);
      toast.error(error.message || "Server error, please try again.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-purple-200 relative overflow-hidden">
      {/* Floating Background Effects */}
      <div className="absolute w-60 h-60 bg-indigo-300 opacity-30 rounded-full blur-3xl top-10 left-10" />
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl bottom-10 right-10" />

      <div className="flex w-full max-w-5xl bg-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] overflow-hidden border border-white/40">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-center w-1/2 p-14 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 backdrop-blur-xl">
          <h1 className="text-4xl font-extrabold text-indigo-800 leading-tight drop-shadow-sm">
            More than just friends,
            <br /> truly connect.
          </h1>
          <p className="mt-4 text-slate-700 text-lg opacity-90 leading-relaxed">
            Join the global community and engage in real conversations.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-1/2 p-12">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
            Sign In
          </h2>
          <p className="text-center text-slate-600 mb-8 text-sm">
            Welcome back! Please sign in to continue.
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Role
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-indigo-400 shadow-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-400 shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
            >
              {loading ? "Loading..." : "Login"}
            </button>

            {/* Bottom Links */}
            <div className="flex justify-between pt-2 text-sm">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>

              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
                onClick={() => navigate("/forget-password")}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
