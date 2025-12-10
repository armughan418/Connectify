import React, { useState, useEffect } from "react";
import { Flag, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import reportService from "../../services/reportService";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      let response;

      if (filter === "pending") {
        response = await reportService.getPendingReports();
      } else {
        response = await reportService.getAllReports();
      }

      let reportsData = [];

      if (response && response.status) {
        if (response.data) {
          if (Array.isArray(response.data)) {
            reportsData = response.data;
          } else if (
            response.data.reports &&
            Array.isArray(response.data.reports)
          ) {
            reportsData = response.data.reports;
          } else if (Array.isArray(response.reports)) {
            reportsData = response.reports;
          }
        }
      }

      if (filter === "resolved") {
        reportsData = reportsData.filter((r) => r && r.status === "resolved");
      } else if (filter === "pending") {
        reportsData = reportsData.filter((r) => r && r.status === "pending");
      }

      setReports(reportsData);
    } catch (error) {
      console.error("Error loading reports:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load reports";
      toast.error(errorMessage);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, action) => {
    if (!reportId) {
      toast.error("Invalid report ID");
      return;
    }

    try {
      const notes =
        action === "resolved"
          ? "Post removed by admin"
          : "Report dismissed by admin";
      await reportService.resolveReport(reportId, action, notes);
      toast.success(
        `Report ${
          action === "resolved" ? "resolved" : "dismissed"
        } successfully`
      );
      loadReports();
    } catch (error) {
      console.error("Error resolving report:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to resolve report";
      toast.error(errorMessage);
    }
  };

  const getPostIdDisplay = (report) => {
    if (!report) return "N/A";

    if (typeof report.postId === "string") {
      return report.postId.length > 8
        ? `${report.postId.slice(0, 8)}...`
        : report.postId;
    } else if (report.postId && typeof report.postId === "object") {
      const id = report.postId._id || report.postId.id || report.postId;
      if (typeof id === "string") {
        return id.length > 8 ? `${id.slice(0, 8)}...` : id;
      }
    }
    return "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              filter === "pending"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              filter === "resolved"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-12 text-center">
              <Flag size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">
                No {filter} reports found
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {filter === "pending"
                  ? "All reports have been resolved"
                  : "No reports available"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => {
                    if (!report || !report._id) return null;

                    return (
                      <tr
                        key={report._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getPostIdDisplay(report)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 capitalize">
                            {report.reason || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {report.reportedBy?.name ||
                            report.reportedBy ||
                            "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              report.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : report.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {report.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {!report.status || report.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleResolve(report._id, "resolved")
                                }
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition text-xs"
                              >
                                <CheckCircle size={14} /> Resolve
                              </button>
                              <button
                                onClick={() =>
                                  handleResolve(report._id, "dismissed")
                                }
                                className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition text-xs"
                              >
                                <XCircle size={14} /> Dismiss
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">
                              {report.status === "resolved"
                                ? "Resolved"
                                : "Dismissed"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
