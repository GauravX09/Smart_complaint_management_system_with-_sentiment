import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../components/Card";
import { toast } from "react-toastify";

// Types
interface Complaint {
  id: number;
  userName: string;
  userEmail: string;
  category: string;
  description: string;
  status: string;
  createdAt: string | null;
}

interface MonthlyData {
  name: string;
  complaints: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    total: number;
    resolved: number;
    pending: number;
    monthly: MonthlyData[];
  }>({
    total: 0,
    resolved: 0,
    pending: 0,
    monthly: [],
  });

  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // FETCH ALL COMPLAINT DATA (Admin Protected)
  // -------------------------------------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // 🔐 Axios instance includes Authorization header
        const res = await API.get<Complaint[]>("/api/complaints/all");
        const complaints = res.data || [];

        // Calculate statistics
        const total = complaints.length;
        const resolved = complaints.filter((c) => c.status === "Resolved").length;
        const pending = complaints.filter((c) => c.status === "Pending").length;

        // Monthly aggregation
        const monthlyMap: Record<string, number> = {};

        complaints.forEach((c) => {
          const month = c.createdAt
            ? new Date(c.createdAt).toLocaleString("default", { month: "short" })
            : "N/A";

          monthlyMap[month] = (monthlyMap[month] || 0) + 1;
        });

        const monthlyArray: MonthlyData[] = Object.keys(monthlyMap).map(
          (month) => ({
            name: month,
            complaints: monthlyMap[month],
          })
        );

        setStats({
          total,
          resolved,
          pending,
          monthly: monthlyArray,
        });
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // -------------------------------------------------------
  // LOADING SCREEN (Admin Experience)
  // -------------------------------------------------------
  if (loading) {
    return (
      <div className="p-6 text-xl text-gray-700">
        Loading dashboard statistics...
      </div>
    );
  }

  // -------------------------------------------------------
  // MAIN UI
  // -------------------------------------------------------
  return (
    <div className="p-6 space-y-6">
      {/* 🌟 GLASSMORPHISM HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full p-6 rounded-3xl bg-white/20 backdrop-blur-xl shadow-xl 
                   border border-white/30 bg-gradient-to-r from-indigo-500/40 to-purple-500/40"
      >
        <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
          👋 Welcome Admin!
        </h2>
        <p className="text-white/90 mt-1 text-lg">
          Here’s your system-wide complaint summary and analytics.
        </p>
      </motion.div>

      {/* 🌟 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            title="Total Complaints"
            value={stats.total.toString()}
            color="bg-gradient-to-r from-blue-500 to-blue-700"
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            title="Resolved Complaints"
            value={stats.resolved.toString()}
            color="bg-gradient-to-r from-green-500 to-green-700"
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            title="Pending Complaints"
            value={stats.pending.toString()}
            color="bg-gradient-to-r from-yellow-400 to-yellow-600"
          />
        </motion.div>

      </div>

      {/* 📊 MONTHLY CHART */}
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-6"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Monthly Complaint Stats
        </h3>

        {stats.monthly.length === 0 ? (
          <p className="text-gray-500">No complaint data to display.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthly}>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="complaints"
                fill="#4f46e5"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
