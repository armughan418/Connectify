import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import adminService from "../services/adminService";
import reportService from "../services/reportService";
import AdminDashboard from "../components/AdminDashboard";

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        adminService.getStats(),
        reportService.getPendingReports(),
      ]);
      setStats(statsRes.data);
      setReports(reportsRes.data || []);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      await reportService.resolveReport(reportId, status);
      toast.success("Report resolved");
      loadData();
    } catch (error) {
      toast.error("Failed to resolve report");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading admin panel...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === "dashboard"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-600"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === "reports"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-600"
          }`}
        >
          Reports ({reports.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "dashboard" ? (
        <AdminDashboard stats={stats} />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Post ID</th>
                <th className="px-6 py-3 text-left">Reason</th>
                <th className="px-6 py-3 text-left">Reported By</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{report.postId}</td>
                  <td className="px-6 py-4 text-sm">{report.reason}</td>
                  <td className="px-6 py-4 text-sm">
                    {report.reportedBy?.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() =>
                        handleResolveReport(report._id, "resolved")
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No pending reports
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
