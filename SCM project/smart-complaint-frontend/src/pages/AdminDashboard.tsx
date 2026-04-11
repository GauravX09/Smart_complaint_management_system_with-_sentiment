import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const COLORS = ["#22c55e", "#ef4444", "#facc15"];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    highRiskComplaints: 0,
  });

  const [monthly, setMonthly] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [negativeComplaints, setNegativeComplaints] = useState<Complaint[]>([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email;

      if (!email) {
        console.error("Email not found");
        return;
      }

      console.log("EMAIL:", email);

      // ✅ FIXED (backticks)
      const statsRes = await API.get(
        `/api/complaints/admin/dashboard?email=${email}`
      );

      console.log("STATS:", statsRes.data);

      setStats({
        totalComplaints: statsRes.data.totalComplaints || 0,
        resolvedComplaints: statsRes.data.resolvedComplaints || 0,
        pendingComplaints: statsRes.data.pendingComplaints || 0,
        highRiskComplaints: statsRes.data.highRiskComplaints || 0,
      });

      // ✅ FIXED (backticks)
      const complaintRes = await API.get(
        `/api/complaints/admin?email=${email}`
      );

      const complaints = complaintRes.data || [];

      // MONTHLY
      const mm: any = {};
      complaints.forEach((c: Complaint) => {
        const month = new Date(c.createdAt).toLocaleString("default", {
          month: "short",
        });
        mm[month] = (mm[month] || 0) + 1;
      });

      setMonthly(
        Object.keys(mm).map((k) => ({
          name: k,
          complaints: mm[k],
        }))
      );

      // SENTIMENT
      let positive = 0,
        negative = 0,
        neutral = 0;

      complaints.forEach((c: Complaint) => {
        if (c.sentiment === "POSITIVE") positive++;
        else if (c.sentiment === "NEGATIVE") negative++;
        else neutral++;
      });

      setSentimentData([
        { name: "Positive", value: positive },
        { name: "Negative", value: negative },
        { name: "Neutral", value: neutral },
      ]);

      // NEGATIVE ALERT
      setNegativeComplaints(
        complaints.filter((c: Complaint) => c.sentiment === "NEGATIVE")
      );
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    if (stats.highRiskComplaints > 0) {
    toast.error("⚠ High Risk Complaints Detected!");
    }
    fetchDashboard();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-6 rounded-xl bg-indigo-600 text-white shadow-xl"
      >
        <h2 className="text-3xl font-bold">🚀 AI Admin Dashboard</h2>
        <p className="mt-1 opacity-90">Smart Complaint Analytics</p>
      </motion.div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="p-6 rounded-xl bg-indigo-600 text-white shadow-xl">
          <p>Total</p>
          <h1 className="text-3xl font-bold">{stats.totalComplaints}</h1>
        </div>

        <div className="p-6 rounded-xl bg-green-600 text-white shadow-xl">
          <p>Resolved</p>
          <h1 className="text-3xl font-bold">{stats.resolvedComplaints}</h1>
        </div>

        <div className="p-6 rounded-xl bg-yellow-500 text-white shadow-xl">
          <p>Pending</p>
          <h1 className="text-3xl font-bold">{stats.pendingComplaints}</h1>
        </div>

        <div className="p-6 rounded-xl bg-red-600 text-white shadow-xl">
          <p>High Risk</p>
          <h1 className="text-3xl font-bold">{stats.highRiskComplaints}</h1>
        </div>

      </div>
       {stats.totalComplaints === 0 && (
       < div className="bg-white p-6 rounded-xl shadow text-center">
       <p className="text-gray-500">No complaints data available</p>
       </div>
       )}
      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h3 className="font-bold mb-4">Monthly Complaints</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl">
          <h3 className="font-bold mb-4">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
                       
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
              >
                {sentimentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            
              <Legend />
            </PieChart>


          </ResponsiveContainer>
        </div>

      </div>

      {/* ALERT */}
      {negativeComplaints.length > 0 && (
        <div className="bg-red-100 p-6 rounded-xl shadow-xl">
          <h3 className="text-red-600 font-bold mb-3">
            🔴 High Risk Complaints
          </h3>

          {negativeComplaints.map((c) => (
            <div key={c.id} className="p-3 bg-white rounded mb-2 border-l-4 border-red-500">
              {c.description}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

