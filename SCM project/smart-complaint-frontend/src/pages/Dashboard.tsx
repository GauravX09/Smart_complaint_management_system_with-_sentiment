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
  PieChart,
  Pie,
  Cell,
  Legend,
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
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    rejected: 0,
    monthly: [] as MonthlyData[],
  });

  const [sentiment, setSentiment] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await API.get<Complaint[]>("/api/complaints/all");
        const complaints = res.data || [];

        // 📊 BASIC STATS
        const total = complaints.length;
        const resolved = complaints.filter((c) => c.status === "Resolved").length;
        const pending = complaints.filter((c) => c.status === "Pending").length;
        const rejected = complaints.filter((c) => c.status === "Rejected").length;

        // 📅 MONTHLY DATA
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

        // 🤖 SENTIMENT ANALYSIS (Keyword-based)
        let positive = 0;
        let negative = 0;
        let neutral = 0;

        complaints.forEach((c) => {
          const text = c.description.toLowerCase();

          if (
            text.includes("good") ||
            text.includes("resolved") ||
            text.includes("thanks")
          ) {
            positive++;
          } else if (
            text.includes("bad") ||
            text.includes("delay") ||
            text.includes("worst") ||
            text.includes("complaint")
          ) {
            negative++;
          } else {
            neutral++;
          }
        });

        setStats({
          total,
          resolved,
          pending,
          rejected,
          monthly: monthlyArray,
        });

        setSentiment({
          positive,
          neutral,
          negative,
        });

      } catch (err: any) {
        toast.error("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 🚀 LOADING UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-600">
        🚀 Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 space-y-6">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl"
      >
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-indigo-100 mt-1">
          Real-time complaint analytics & AI insights
        </p>
      </motion.div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card title="Total" value={stats.total.toString()} color="bg-indigo-600" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card title="Resolved" value={stats.resolved.toString()} color="bg-green-600" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card title="Pending" value={stats.pending.toString()} color="bg-yellow-500" />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <Card title="Rejected" value={stats.rejected.toString()} color="bg-red-500" />
        </motion.div>
      </div>

      {/* CHART + INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* BAR CHART */}
        <motion.div
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
            Monthly Complaints
          </h3>

          {stats.monthly.length === 0 ? (
            <p>No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthly}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complaints" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* QUICK INSIGHTS */}
        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
            Insights
          </h3>

          <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <li>📊 Total: {stats.total}</li>
            <li>🟢 Resolved: {stats.resolved}</li>
            <li>🟡 Pending: {stats.pending}</li>
            <li>🔴 Rejected: {stats.rejected}</li>
          </ul>
        </motion.div>
      </div>

      {/* 🤖 AI SENTIMENT */}
      <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
          AI Sentiment Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PIE */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Positive", value: sentiment.positive },
                    { name: "Neutral", value: sentiment.neutral },
                    { name: "Negative", value: sentiment.negative },
                  ]}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#eab308" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center space-y-3 text-gray-700 dark:text-gray-300">
            <p>🟢 Positive: {sentiment.positive}</p>
            <p>🟡 Neutral: {sentiment.neutral}</p>
            <p>🔴 Negative: {sentiment.negative}</p>

            {sentiment.negative > sentiment.positive && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                ⚠️ High negative complaints detected!
              </div>
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;