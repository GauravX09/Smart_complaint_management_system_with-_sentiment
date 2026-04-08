import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

interface DashboardStats {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  highRiskComplaints: number;
}

interface Complaint {
  id: number;
  createdAt: string;
  description: string;
  sentiment: string;
}

const COLORS = ["#22c55e", "#ef4444", "#facc15"]; // POSITIVE, NEGATIVE, NEUTRAL

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    highRiskComplaints: 0,
  });

  const [monthly, setMonthly] = useState<
    { name: string; complaints: number }[]
  >([]);

  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [negativeComplaints, setNegativeComplaints] = useState<Complaint[]>([]);

  // ================= FETCH =================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email;

      if (!email) return;

      // 🔹 Dashboard stats
      const statsRes = await API.get(
        '/api/complaints/admin/dashboard?email=${email}'
      );
      setStats(statsRes.data);

      // 🔹 Complaints
      const complaintRes = await API.get<Complaint[]>(
        '/api/complaints/admin?email=${email}'
      );

      const complaints = complaintRes.data || [];

      // ================= MONTHLY =================
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
        Object.keys(mm).map((k) => ({
          name: k,
          complaints: mm[k],
        }))
      );

      // ================= SENTIMENT =================
      let positive = 0,
        negative = 0,
        neutral = 0;

      complaints.forEach((c) => {
        if (c.sentiment === "POSITIVE") positive++;
        else if (c.sentiment === "NEGATIVE") negative++;
        else neutral++;
      });

      setSentimentData([
        { name: "Positive", value: positive },
        { name: "Negative", value: negative },
        { name: "Neutral", value: neutral },
      ]);

      // ================= NEGATIVE ALERT =================
      setNegativeComplaints(
        complaints.filter((c) => c.sentiment === "NEGATIVE")
      );
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-gradient-to-r from-purple-600/40 to-indigo-600/40 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white">
          🚀 AI Admin Dashboard
        </h2>
        <p className="text-white/90 mt-1">
          Smart Complaint Analytics with AI
        </p>
      </motion.div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl text-white bg-indigo-600 shadow-xl">
          <p>Total</p>
          <h1 className="text-3xl font-bold">{stats.totalComplaints}</h1>
        </div>

        <div className="p-6 rounded-xl text-white bg-green-600 shadow-xl">
          <p>Resolved</p>
          <h1 className="text-3xl font-bold">{stats.resolvedComplaints}</h1>
        </div>

        <div className="p-6 rounded-xl text-white bg-yellow-500 shadow-xl">
          <p>Pending</p>
          <h1 className="text-3xl font-bold">{stats.pendingComplaints}</h1>
        </div>

        <div className="p-6 rounded-xl text-white bg-red-600 shadow-xl">
          <p>High Risk</p>
          <h1 className="text-3xl font-bold">{stats.highRiskComplaints}</h1>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h3 className="font-bold mb-4">Monthly Complaints</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h3 className="font-bold mb-4">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {sentimentData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEGATIVE ALERT */}
      {negativeComplaints.length > 0 && (
        <div className="bg-red-100 p-6 rounded-xl shadow-xl">
          <h3 className="text-red-600 font-bold mb-3">
            🔴 High Risk Complaints
          </h3>

          {negativeComplaints.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-white rounded mb-2 border-l-4 border-red-500"
            >
              <p className="text-sm">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

