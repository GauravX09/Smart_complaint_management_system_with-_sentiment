import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Users,
  Shield,
  RefreshCcw,
  Download,
  Brain,
} from "lucide-react";
import API from "../../services/api";

const COLORS = ["#6366F1", "#22C55E"];

interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalUsers: number;
  totalAdmins: number;
}

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalUsers: 0,
    totalAdmins: 0,
  });

  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/super-admin/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  /* ================= CHART DATA ================= */
  const barData = [
    { name: "Total", value: stats.totalComplaints },
    { name: "Pending", value: stats.pendingComplaints },
    { name: "Resolved", value: stats.resolvedComplaints },
  ];

  const pieData = [
    { name: "Admins", value: stats.totalAdmins },
    { name: "Users", value: stats.totalUsers },
  ];

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Super Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            System overview & real-time monitoring
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchDashboardStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* ================= SYSTEM OVERVIEW ================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold">System Health Overview</h2>
        <p className="text-white/80 mt-1">
          Live complaints, users, and admin activity snapshot
        </p>
      </motion.div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={<ClipboardList />}
          gradient="from-indigo-500 to-indigo-700"
        />
        <StatCard
          title="Pending"
          value={stats.pendingComplaints}
          icon={<Clock />}
          gradient="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedComplaints}
          icon={<CheckCircle />}
          gradient="from-green-500 to-green-700"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users />}
          gradient="from-blue-500 to-blue-700"
        />
        <StatCard
          title="Admins"
          value={stats.totalAdmins}
          icon={<Shield />}
          gradient="from-pink-500 to-purple-600"
        />
      </div>

      {/* ================= AI SENTIMENT SUMMARY ================= */}
      <div className="bg-white rounded-3xl p-6 shadow-lg flex items-start gap-4">
        <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
          <Brain />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Sentiment Summary</h3>
          <p className="text-sm text-gray-500 mt-1">
            AI sentiment will appear once complaints are analyzed
          </p>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Complaint Statistics
          </h3>

          {stats.totalComplaints === 0 ? (
            <p className="text-gray-500 text-center py-20">
              No complaints data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#6366F1"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            User Distribution
          </h3>

          {stats.totalUsers === 0 && stats.totalAdmins === 0 ? (
            <p className="text-gray-500 text-center py-20">
              No user data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  gradient,
}) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <div
      className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${gradient}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  </motion.div>
);

export default SuperAdminDashboard;
