import api from "../utils/api";
import { useEffect, useState } from "react";
import { FaChartBar, FaUsers, FaShoppingCart, FaStar } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "../components/adminSidebar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    topProducts: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const res = await fetch(api().adminStat, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to fetch stats:", errorData.message || res.statusText);
          return;
        }

        const data = await res.json();
        if (data.status) {
          // Ensure all required fields are present
          setStats({
            totalOrders: data.totalOrders || 0,
            totalUsers: data.totalUsers || 0,
            totalProducts: data.totalProducts || 0,
            totalSales: data.totalSales || 0,
            topProducts: data.topProducts || [],
          });
        } else {
          console.error("Failed to fetch stats:", data.message);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Prepare line chart data from topProducts
  const lineData = (stats.topProducts || []).map((p) => ({
    name: p.name || "Unknown",
    sales: p.quantitySold || 0,
  }));

  // Pie chart for product distribution
  const pieData = (stats.topProducts || []).map((p) => ({
    name: p.name || "Unknown",
    value: p.quantitySold || 0,
  }));

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {[
          {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: <FaShoppingCart />,
          },
          { title: "Total Users", value: stats.totalUsers, icon: <FaUsers /> },
          {
            title: "Total Products",
            value: stats.totalProducts,
            icon: <FaStar />,
          },
          {
            title: "Total Sales",
            value: "Rs " + stats.totalSales,
            icon: <FaChartBar />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition border-l-4 border-orange-500 relative"
          >
            <h3 className="text-gray-500 text-sm">{item.title}</h3>
            <p className="text-3xl font-extrabold mt-2 text-orange-600">
              {item.value}
            </p>
            <div className="absolute right-6 top-6 text-3xl text-orange-300">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">
            Top Products Sold
          </h3>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#f97316"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-gray-400">
              No product sales data available
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-4 text-orange-600">
            Top Products Share
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={85}
                  fill="#f97316"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-gray-400">
              No product sales data available
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
