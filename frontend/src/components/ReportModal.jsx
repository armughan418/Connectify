import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import reportService from "../services/reportService";

const ReportModal = ({ postId, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reasonOptions = [
    { label: "Spam", value: "spam" },
    { label: "Offensive Content", value: "offensive" },
    { label: "Harassment or Bullying", value: "harassment" },
    { label: "Inappropriate Content", value: "inappropriate" },
    { label: "Other", value: "other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError("Please select a reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await reportService.reportPost({
        postId,
        reason,
        description,
      });

      if (response.status) {
        toast.success(response.message || "Report submitted successfully");
        onSubmit();
        onClose();
      } else {
        throw new Error(response.message || "Failed to submit report");
      }
    } catch (err) {
      console.error("Report error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit report";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="text-red-500" />
          Report Post
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select a reason</option>
              {reasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="4"
            ></textarea>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
