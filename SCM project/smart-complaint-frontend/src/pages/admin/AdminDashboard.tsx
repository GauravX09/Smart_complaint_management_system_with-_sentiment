import { toast } from "react-toastify";
//@ts-ignore
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import API from "../../services/api";
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
} from "recharts";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

/* ✅ IMPORT UI COMPONENTS */
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/Skeleton";

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
      if (!email) return;

      const statsRes = await API.get(
        `/api/complaints/admin/dashboard?email=${email}`
      );

      setStats(statsRes.data);

      const complaintRes = await API.get(
        `/api/complaints/admin?email=${email}`
      );

      const complaints = complaintRes.data || [];

      // Monthly
      const mm: any = {};
      complaints.forEach((c: Complaint) => {
        const m = new Date(c.createdAt).toLocaleString("default", {
          month: "short",
        });
        mm[m] = (mm[m] || 0) + 1;
      });

      setMonthly(
        Object.keys(mm).map((k) => ({ name: k, complaints: mm[k] }))
      );

      // Sentiment
      let p = 0,
        n = 0,
        ne = 0;

      complaints.forEach((c: Complaint) => {
        if (c.sentiment === "POSITIVE") p++;
        else if (c.sentiment === "NEGATIVE") n++;
        else ne++;
      });

      setSentimentData([
        { name: "Positive", value: p },
        { name: "Negative", value: n },
        { name: "Neutral", value: ne },
      ]);

      setNegativeComplaints(
        complaints.filter((c: Complaint) => c.sentiment === "NEGATIVE")
      );

     toast.dismiss(); // clear previous

    if (statsRes.data.highRiskComplaints > 0) {
      toast.error("⚠ High Risk Complaints Detected!", {
        toastId: "high-risk-alert", // prevents duplicate
      });
    }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ✅ SKELETON LOADER */
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-6 w-40" />

        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-72 rounded-xl" />

        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 min-h-screen"
    >
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Monitor complaints and system performance
            </p>
          </div>

          <Button onClick={fetchDashboard}>
            Refresh
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <p className="text-gray-500 text-sm">Total</p>
            <h2 className="text-2xl font-bold">{stats.totalComplaints}</h2>
          </Card>

          <Card>
            <p className="text-gray-500 text-sm">Resolved</p>
            <h2 className="text-2xl font-bold text-green-600">
              {stats.resolvedComplaints}
            </h2>
          </Card>

          <Card>
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-2xl font-bold text-yellow-500">
              {stats.pendingComplaints}
            </h2>
          </Card>

          <Card>
            <p className="text-gray-500 text-sm">High Risk</p>
            <h2 className="text-2xl font-bold text-red-500">
              {stats.highRiskComplaints}
            </h2>
          </Card>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CHART */}
          <Card className="lg:col-span-2">
            <h3 className="font-semibold mb-4">Complaint Trends</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthly}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complaints" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* INSIGHTS */}
          <Card>
            <h3 className="font-semibold mb-4">Insights</h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Total</span>
                <Badge>{stats.totalComplaints}</Badge>
              </div>

              <div className="flex justify-between">
                <span>High Risk</span>
                <Badge variant="danger">
                  {stats.highRiskComplaints}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Resolved Rate</span>
                <Badge variant="success">
                  {stats.totalComplaints
                    ? Math.round(
                        (stats.resolvedComplaints /
                          stats.totalComplaints) *
                          100
                      )
                    : 0}
                  %
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* SENTIMENT + ALERT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* SENTIMENT */}
          <Card className="relative">
            <h3 className="font-semibold mb-4">Sentiment</h3>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sentimentData} dataKey="value" innerRadius={70}>
                  {sentimentData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-center">
              <h2 className="font-bold text-xl">
                {stats.totalComplaints}
              </h2>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </Card>

          {/* ALERT */}
          <Card className="bg-red-50 border-red-200">
            <h3 className="text-red-600 font-semibold mb-4">
              High Risk Alerts
            </h3>

            {negativeComplaints.length === 0 ? (
              <p className="text-gray-500">
                No high-risk complaints
              </p>
            ) : (
              negativeComplaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-3 rounded mb-2 border-l-4 border-red-500"
                >
                  {c.description}
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;