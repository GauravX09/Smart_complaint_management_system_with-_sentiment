import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

interface Complaint {
  id: number;
  status: string;
  createdAt: string | null;
  category: string;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [resolved, setResolved] = useState(0);
  const [pending, setPending] = useState(0);
  const [monthly, setMonthly] = useState<
    { name: string; complaints: number }[]
  >([]);

  // ================= FETCH DASHBOARD STATS =================
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get<Complaint[]>("/api/complaints/all");
      const complaints = res.data || [];

      // COUNTS
      setTotal(complaints.length);

      setResolved(
        complaints.filter(
          (c) => c.status?.toUpperCase() === "RESOLVED"
        ).length
      );

      setPending(
        complaints.filter(
          (c) => c.status?.toUpperCase() === "PENDING"
        ).length
      );

      // MONTHLY AGGREGATION
      const mm: Record<string, number> = {};
      complaints.forEach((c) => {
        const month = c.createdAt
          ? new Date(c.createdAt).toLocaleString("default", {
              month: "short",
            })
          : "Unknown";
        mm[month] = (mm[month] || 0) + 1;
      });

      setMonthly(
        Object.keys(mm)
          .map((k) => ({
            name: k,
            complaints: mm[k],
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO REFRESH (LIVE) =================
  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-8">
      {/* 🌟 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full p-6 rounded-3xl bg-white/20 backdrop-blur-xl shadow-xl
                   border border-white/30 bg-gradient-to-r from-purple-600/40 to-indigo-600/40"
      >
        <h2 className="text-3xl font-extrabold text-white drop-shadow-md">
          🔐 Admin Dashboard
        </h2>
        <p className="text-white/90 mt-1 text-lg">
          Manage complaints, users, and system analytics.
        </p>
      </motion.div>

      {/* 🌟 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="p-6 rounded-2xl shadow-xl text-white 
                          bg-gradient-to-r from-indigo-500 to-indigo-700">
            <div className="text-sm opacity-90">Total Complaints</div>
            <div className="text-4xl font-bold mt-3">{total}</div>
          </div>
        </motion.div>

        {/* Resolved */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="p-6 rounded-2xl shadow-xl text-white 
                          bg-gradient-to-r from-green-500 to-green-700">
            <div className="text-sm opacity-90">Resolved</div>
            <div className="text-4xl font-bold mt-3">{resolved}</div>
          </div>
        </motion.div>

        {/* Pending */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="p-6 rounded-2xl shadow-xl text-white 
                          bg-gradient-to-r from-yellow-400 to-yellow-600">
            <div className="text-sm opacity-90">Pending</div>
            <div className="text-4xl font-bold mt-3">{pending}</div>
          </div>
        </motion.div>
      </div>

      {/* 📊 MONTHLY CHART */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4 text-gray-700">
          Monthly Complaints Overview
        </h3>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <XAxis dataKey="name" stroke="#444" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="complaints"
                fill="#7c3aed"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
