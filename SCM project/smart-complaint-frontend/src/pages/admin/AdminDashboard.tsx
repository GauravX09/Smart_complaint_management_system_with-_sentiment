import { toast } from "react-toastify";
//@ts-ignore
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
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
  category: string;
}

const CATEGORY_COLORS = [
  "#6366F1", // Infrastructure
  "#3B82F6", // Electricity
  "#22C55E", // Water
  "#F59E0B", // Others
];

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    highRiskComplaints: 0,
  });

  const [monthly, setMonthly] = useState<any[]>([]);
  const [negativeComplaints, setNegativeComplaints] = useState<Complaint[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

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

      // ================= MONTHLY =================
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

      // ================= CATEGORY =================
      const categoryMap: Record<string, number> = {};
      complaints.forEach((c: Complaint) => {
        const cat = c.category || "Others";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      const total = complaints.length;

      const categoryArr = Object.keys(categoryMap).map((key) => ({
        name: key,
        value: categoryMap[key],
        percentage: Math.round((categoryMap[key] / total) * 100),
      }));

      setCategoryData(categoryArr);

      // ================= ALERT =================
      setNegativeComplaints(
        complaints.filter((c: Complaint) => c.sentiment === "NEGATIVE")
      );

      toast.dismiss();

      if (statsRes.data.highRiskComplaints > 0) {
        toast.error("⚠ High Risk Complaints Detected!", {
          toastId: "high-risk-alert",
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

  // ================= LOADER =================
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
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500 text-sm">
            Monitor complaints and system performance
          </p>
        </div>

        <Button onClick={fetchDashboard}>Refresh</Button>
      </div>

      {/* KPI CARDS */}
        <div className="grid grid-cols-4 gap-6">
      {[
        {
          title: "Total Complaints",
          value: stats.totalComplaints,
          change: "+12.5%",
          color: "text-blue-500",
          bg: "bg-blue-50",
        },
        {
          title: "Pending",
          value: stats.pendingComplaints,
          change: "+8.2%",
          color: "text-orange-500",
          bg: "bg-orange-50",
        },
        {
          title: "Resolved",
          value: stats.resolvedComplaints,
          change: "+15.3%",
          color: "text-green-500",
          bg: "bg-green-50",
        },
        {
          title: "High Priority",
          value: stats.highRiskComplaints,
          change: "+20.4%",
          color: "text-red-500",
          bg: "bg-red-50",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4"
        >
          <div className={`p-3 rounded-lg ${item.bg}`}>
            <div className={`w-5 h-5 ${item.color}`} />
          </div>
    
          <div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-xl font-bold">{item.value}</h2>
            <p className={`text-xs ${item.color}`}>
              {item.change} from last month
            </p>
          </div>
        </div>
      ))}
      </div>

     {/* CHART + PIE (FIXED PREMIUM LAYOUT) */}
      <div className="grid grid-cols-3 gap-6 mt-6">
      
        {/* 📊 LEFT: AREA CHART */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">
              Complaints Trend
            </h3>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
              This Month
            </span>
          </div>
      
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
              </defs>
      
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
      
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        />
      
              <Area
                type="monotone"
                dataKey="complaints"
                stroke="#6366F1"
                strokeWidth={3}
                fill="url(#colorComplaints)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      
        {/* 🍩 RIGHT: CATEGORY DONUT */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
      
          <h3 className="font-semibold text-gray-700 mb-4">
            Category Distribution
          </h3>
      
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
              >
                {categoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
      
          {/* CENTER TEXT */}
               <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center -mt-24"
      >
        <p className="text-2xl font-bold text-gray-800">
          {stats.totalComplaints}
        </p>
        <p className="text-xs text-gray-400">Total</p>
      </motion.div>
      
          {/* LEGEND */}
          <div className="mt-4 w-full space-y-2 text-sm">
            {categoryData.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: CATEGORY_COLORS[i] }}
                    />
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-600">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
        
          </div>
        
        </div>

      {/* ALERT */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-red-100 p-6">
      
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-red-600 font-semibold flex items-center gap-2">
            ⚠ High Risk Alerts
          </h3>
      
          <button className="text-sm text-indigo-600 hover:underline">
            View All
          </button>
        </div>

        {/* CONTENT */}
        {negativeComplaints.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            No high-risk complaints 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {negativeComplaints.slice(0, 3).map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center bg-red-50 border border-red-100 rounded-lg p-4 transition"
              >
                {/* LEFT */}
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-lg mt-1">
                    ⚠
                  </div>
      
                  <div>
                    <p className="text-gray-800 text-sm font-medium">
                      {c.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Complaint ID: #{c.id}
                    </p>
                  </div>
                </div>
      
                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
                    HIGH
                  </span>
      
                  <button
                    className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600"
                    onClick={() => window.location.href = `/admin/complaints/${c.id}`}
                  >
                    Open
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      
      </div>

    </div>
  );
};

export default AdminDashboard;