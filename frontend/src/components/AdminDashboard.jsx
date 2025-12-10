import React from "react";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>

        <p className="text-3xl font-bold mt-2">
          <CountUp start={0} end={value} duration={2} separator="," />
        </p>
      </div>

      {Icon && <Icon className="text-4xl opacity-20" />}
    </div>
  </div>
);

const AdminDashboard = ({ stats }) => {
  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          color="border-blue-500"
        />

        <StatsCard
          title="Total Posts"
          value={stats?.totalPosts || 0}
          color="border-green-500"
        />

        <StatsCard
          title="Pending Reports"
          value={stats?.pendingReports || 0}
          color="border-red-500"
        />

        <StatsCard
          title="Resolved Reports"
          value={stats?.resolvedReports || 0}
          color="border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats?.monthlyStats && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">Monthly Users</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats?.categories && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">Post Categories</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stats.categories.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {stats?.reportStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold mb-4">Reports by Reason</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.reportStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reason" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ef4444" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
