import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Flag,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  UserPlus,
  MessageSquare,
  User,
} from "lucide-react";
import adminService from "../services/adminService";
import reportService from "../services/reportService";
import authService from "../services/authService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated() || user?.role !== "admin") {
      toast.error("Admin access required");
      navigate("/login");
      return;
    }
    loadStats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const loadStats = async () => {
    try {
      const response = await adminService.getStats();
      if (response.status && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Users", path: "/admin-dashboard/users", icon: Users },
    { name: "Reports", path: "/admin-dashboard/reports", icon: Flag },
    { name: "Settings", path: "/admin-dashboard/settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative dropdown-container">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user?.name || "Admin"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600">
                        {user?.name?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {user?.name || "Admin"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate("/admin-dashboard/profile");
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full transition"
                      >
                        <User size={18} />
                        My Profile
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static lg:translate-x-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <main className="flex-1 p-6">
          {location.pathname === "/admin-dashboard" ||
          location.pathname === "/admin-dashboard/" ? (
            <DashboardContent stats={stats} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

const DashboardContent = ({ stats }) => {
  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No stats available</p>
      </div>
    );
  }

  const { totals, today, postsByCategory, monthly } = stats;

  const monthlyLabels = monthly.newUsers.map((m) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[m._id.month - 1]} ${m._id.year}`;
  });

  const monthlyUsersData = monthly.newUsers.map((m) => m.newUsers);
  const monthlyPostsData = monthly.posts.map((m) => m.posts);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totals.totalUsers}
          icon={Users}
          color="blue"
          change={today.newUsersToday}
          changeLabel="New today"
        />
        <StatCard
          title="Total Posts"
          value={totals.totalPosts}
          icon={FileText}
          color="green"
          change={today.newPostsToday}
          changeLabel="New today"
        />
        <StatCard
          title="Total Comments"
          value={totals.totalComments}
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Pending Reports"
          value={totals.totalReports}
          icon={Flag}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              New Users (Last 6 Months)
            </h3>
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <SimpleBarChart
            labels={monthlyLabels}
            data={monthlyUsersData}
            color="rgb(59, 130, 246)"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              New Posts (Last 6 Months)
            </h3>
            <BarChart3 className="text-green-600" size={20} />
          </div>
          <SimpleBarChart
            labels={monthlyLabels}
            data={monthlyPostsData}
            color="rgb(34, 197, 94)"
          />
        </div>
      </div>

      {Object.keys(postsByCategory).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Posts by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(postsByCategory).map(([category, count]) => (
              <div
                key={category}
                className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg"
              >
                <p className="text-sm text-gray-600 capitalize">{category}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, change, changeLabel }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className="text-xs text-gray-500 mt-2">
              +{change} {changeLabel}
            </p>
          )}
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
};

const SimpleBarChart = ({ labels, data, color }) => {
  const maxValue = Math.max(...data, 1);

  return (
    <div className="space-y-2">
      {labels.map((label, index) => {
        const percentage = (data[index] / maxValue) * 100;
        return (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-xs text-gray-600 truncate">{label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              >
                <span className="text-xs font-medium text-white">
                  {data[index]}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminDashboard;
