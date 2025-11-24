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
          localStorage.setItem("authToken", token);
        }

        if (result.user) {
          const userData = {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-200 p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-orange-200">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-orange-700 text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-slate-600 mb-8">
          Login to continue to your dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Select Role
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 text-slate-800 
              focus:outline-none focus:ring-2 focus:ring-orange-400 transition shadow-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 text-slate-800 
              placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 
              transition shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 text-slate-800 
              placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 
              transition shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl
            shadow-lg hover:bg-orange-700 hover:shadow-xl transition-transform duration-200 
            hover:scale-[1.02]"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <div className="flex justify-between pt-2 text-sm">
            <button
              type="button"
              className="text-orange-600 hover:text-orange-700 font-medium transition"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
            <button
              type="button"
              className="text-orange-600 hover:text-orange-700 font-medium transition"
              onClick={() => navigate("/forget-password")}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
