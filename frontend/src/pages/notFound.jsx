import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function NotFound() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(api().getAcess, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.status && result.isAdmin) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  const handleNavigate = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
    } else if (isAdmin) {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-purple-200">
        <div className="text-indigo-700 font-semibold text-lg animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-purple-200 relative overflow-hidden">
      <div className="absolute w-60 h-60 bg-indigo-300 opacity-30 rounded-full blur-3xl top-10 left-10" />
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl bottom-10 right-10" />

      <div className="relative z-10 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] max-w-md w-full p-10 text-center">
        <h1 className="text-6xl font-extrabold text-indigo-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="space-y-3">
          {localStorage.getItem("authToken") ? (
            <>
              <button
                onClick={handleNavigate}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
              >
                {isAdmin ? "Go to Admin Dashboard" : "Go to Home"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 bg-white/70 text-indigo-700 font-semibold rounded-xl border border-indigo-300 hover:bg-white/90 transition"
              >
                Go Back
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full px-6 py-3 bg-white/70 text-indigo-700 font-semibold rounded-xl border border-indigo-300 hover:bg-white/90 transition"
              >
                Go to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotFound;
