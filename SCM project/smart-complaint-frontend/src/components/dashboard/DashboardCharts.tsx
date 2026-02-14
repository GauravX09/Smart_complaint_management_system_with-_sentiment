import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Props = {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalUsers: number;
  totalAdmins: number;
};

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

const DashboardCharts: React.FC<Props> = ({
  totalComplaints,
  pendingComplaints,
  resolvedComplaints,
  totalUsers,
  totalAdmins,
}) => {
  const complaintData = [
    { name: "Total", value: totalComplaints },
    { name: "Pending", value: pendingComplaints },
    { name: "Resolved", value: resolvedComplaints },
  ];

  const userData = [
    { name: "Users", value: totalUsers },
    { name: "Admins", value: totalAdmins },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {/* ================= COMPLAINT BAR CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Complaint Statistics
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={complaintData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= USER PIE CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          User Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={userData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {userData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
