import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import api from "../utils/api";

function Super() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRouteAccess = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuth(false);
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
        console.log("🔑 Super.jsx result:", result);

        if (!response.ok || !result.status) {
          setIsAuth(false);
        } else {
          setIsAuth(true);
        }
      } catch (err) {
        console.error("Super.jsx error:", err);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    getRouteAccess();
  }, []);

  if (loading) {
    return (
      <div className="h-screen font-bold text-4xl flex justify-center items-center text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Loading...
      </div>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}

export default Super;
