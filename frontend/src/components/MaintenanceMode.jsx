import React from "react";
import { AlertCircle, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const MaintenanceMode = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  if (isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Wrench className="text-yellow-600" size={40} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Site Under Maintenance
        </h1>
        <p className="text-gray-600 mb-4">
          We're currently performing some updates to improve your experience.
          Please check back soon.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <AlertCircle size={16} />
          <span>We apologize for any inconvenience</span>
        </div>
        <button
          type="button"
          onClick={() => {
            try {
              authService.logoutUser();
              window.location.href = "/login";
            } catch (error) {
              console.error("Error navigating to login:", error);
              window.location.href = "/login";
            }
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default MaintenanceMode;
