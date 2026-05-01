import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";
import { toast } from "react-toastify";

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
} from "recharts";

const COLORS = ["#6366f1", "#22c55e"];

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    resolved: 0,
    users: 0,
    admins: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
  try {
    setLoading(true);

    const res = await API.get("/api/complaints/super-admin/dashboard");

    const data = res.data;

    console.log("🔥 API DATA:", data);

    setStats({
      totalComplaints: data.totalComplaints || 0,
      pending: data.pendingComplaints || 0,
      resolved: data.resolvedComplaints || 0,
      users: data.totalUsers || 0,
      admins: data.totalAdmins || 0,
    });

  } catch (error) {
    console.error(error);
    toast.error("Dashboard load failed");
   } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 🔄 REFRESH
  const handleRefresh = () => {
    fetchDashboardData();
    toast.success("Dashboard refreshed");
  };

  // 📥 EXPORT
  const handleExport = async () => {
    try {
      const res = await API.get("/api/reports/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dashboard_report.csv");
      document.body.appendChild(link);
      link.click();

      toast.success("Report downloaded");
    } catch {
      toast.error("Export failed");
    }
  };

  const barData = [
  { name: "Total", value: stats.totalComplaints },
  { name: "Pending", value: stats.pending },
  { name: "Resolved", value: stats.resolved },
  ];

  const pieData = [
    { name: "Users", value: stats.users },
    { name: "Admins", value: stats.admins },
  ];

  return (
    <div className="p-6">

      {/* 🔥 HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white rounded-2xl p-8 mb-8 shadow-lg"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-3">
              🚀 System Overview
            </div>

            <h1 className="text-3xl md:text-4xl font-bold">
              Super Admin Dashboard
            </h1>

            <p className="mt-2 text-indigo-100">
              Monitor complaints, users and system performance in real-time.
            </p>

            <div className="flex gap-4 mt-5">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-semibold hover:scale-105 transition"
              >
                🔄 Refresh
              </button>

              <button
                onClick={handleExport}
                className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition"
              >
                ⬇ Export
              </button>
            </div>
          </div>

          <div className="hidden md:flex w-32 h-32 bg-white/20 rounded-full items-center justify-center text-5xl">
            📊
          </div>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          <StatCard label="Total Complaints" value={stats.totalComplaints} />
          <StatCard label="Pending" value={stats.pending} color="yellow" />
          <StatCard label="Resolved" value={stats.resolved} color="green" />
          <StatCard label="Users" value={stats.users} color="blue" />
          <StatCard label="Admins" value={stats.admins} color="pink" />
        </div>

        {loading && (
          <p className="text-sm mt-4 text-indigo-200">Loading data...</p>
        )}
      </motion.div>

      {/* 📊 CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">📊 Complaint Overview</h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">👥 User Distribution</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* EXTRA */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">🧠 AI Sentiment Summary</h2>
          <p className="text-gray-500">
            Positive: 60% | Neutral: 25% | Negative: 15%
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-2">⚡ System Status</h2>
          <p className="text-green-600">All systems operational</p>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;


// 🔥 STAT CARD
const StatCard = ({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: number;
  color?: string;
}) => {
  const colors: any = {
    default: "bg-white/10 text-white",
    yellow: "bg-yellow-400/20 text-yellow-200",
    green: "bg-green-400/20 text-green-200",
    blue: "bg-blue-400/20 text-blue-200",
    pink: "bg-pink-400/20 text-pink-200",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-lg ${colors[color]}`}
    >
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </motion.div>
  );
};