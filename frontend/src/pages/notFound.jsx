import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      {/* Gradient Box with Shadow */}
      <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl text-white mb-4">Page Not Found</h2>
        <p className="text-white/90 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-white text-purple-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
