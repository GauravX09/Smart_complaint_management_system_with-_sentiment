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
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Complaint {
  id: number;
  status: string;
  createdAt: string | null;
}

const StudentDashboard: React.FC = () => {
  const email = localStorage.getItem("email");

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    rejected: 0,
    monthly: [] as { name: string; complaints: number }[],
  });

  useEffect(() => {
    if (!email) return;

    API.get<Complaint[]>(`/api/complaints/user/${email}`)
      .then((res) => {
        const data = res.data;

        const total = data.length;
        const resolved = data.filter((c) => c.status === "Resolved").length;
        const pending = data.filter((c) => c.status === "Pending").length;
        const rejected = data.filter((c) => c.status === "Rejected").length;

        const monthMap: Record<string, number> = {};
        data.forEach((c) => {
          const month = c.createdAt
            ? new Date(c.createdAt).toLocaleString("default", {
                month: "short",
              })
            : "N/A";
          monthMap[month] = (monthMap[month] || 0) + 1;
        });

        const monthly = Object.keys(monthMap).map((m) => ({
          name: m,
          complaints: monthMap[m],
        }));

        setStats({ total, resolved, pending, rejected, monthly });
      })
      .catch(() => {});
  }, [email]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 md:p-8 text-white shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
      >
        <h2 className="text-3xl font-bold">👋 Welcome back!</h2>
        <p className="mt-2 text-white/80 text-lg">
          Track, manage, and monitor your complaints in one place.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          icon={<ClipboardList />}
          gradient="from-blue-500 to-blue-700"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircle />}
          gradient="from-green-500 to-green-700"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock />}
          gradient="from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle />}
          gradient="from-red-500 to-red-700"
        />
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8"
      >
        <h3 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
          📊 Monthly Complaint Activity
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={stats.monthly}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="complaints"
              fill="#7c3aed"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

/* ----------------------------- */
/* Reusable Stat Card Component  */
/* ----------------------------- */
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
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
    <div
      className={`rounded-2xl p-5 text-white shadow-lg bg-gradient-to-r ${gradient}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  </motion.div>
);

export default StudentDashboard;
