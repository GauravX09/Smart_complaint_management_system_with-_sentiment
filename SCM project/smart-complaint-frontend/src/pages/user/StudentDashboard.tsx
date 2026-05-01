import React, { useEffect, useState } from "react";
import API from "../../services/api";

// ✅ Components
import DashboardHero from "../../components/dashboard/DashboardHero";
import StatsOverview from "../../components/dashboard/StatsOverview";
import DashboardSummary from "../../components/dashboard/DashboardSummary";
import RecentComplaints from "../../components/dashboard/RecentComplaints";
import ComplaintsChart from "../../components/dashboard/ComplaintsChart";

// Types
interface ApiComplaint {
  id: number;
  category: string;
  description: string;
  status: "RESOLVED" | "PENDING" | "REJECTED";
  createdAt: string;
}

interface Complaint extends ApiComplaint {
  date: string;
}

interface MonthlyData {
  month: string;
  count: number;
}

const StudentDashboard = () => {
  const email = localStorage.getItem("userEmail");

  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    rejected: 0,
  });

  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    API.get(`/api/complaints/user/${email}`)
      .then((res) => {
        const apiData: ApiComplaint[] = res.data || [];

        // ✅ Stats Calculation
        const total = apiData.length;
        const resolved = apiData.filter((c) => c.status === "RESOLVED").length;
        const pending = apiData.filter((c) => c.status === "PENDING").length;
        const rejected = apiData.filter((c) => c.status === "REJECTED").length;

        setStats({ total, resolved, pending, rejected });

        // ✅ Monthly Data
        const monthMap: Record<string, number> = {};

        apiData.forEach((c) => {
          const date = new Date(c.createdAt);
          const month = date.toLocaleString("default", { month: "short" });

          monthMap[month] = (monthMap[month] || 0) + 1;
        });

        const monthlyData = Object.entries(monthMap).map(
          ([month, count]) => ({
            month,
            count,
          })
        );

        setMonthly(monthlyData);

        // ✅ Recent Complaints (latest 5)
        setComplaints(apiData.slice(0, 5).map((c) => ({ ...c, date: c.createdAt })));

        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, [email]);

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ❌ Error UI
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 🔥 HERO */}
      <DashboardHero userName="User" />

      {/* 📊 STATS */}
      <StatsOverview
        total={stats.total}
        resolved={stats.resolved}
        pending={stats.pending}
        rejected={stats.rejected}
      />

      {/* 📈 CHART + SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2">
          <ComplaintsChart
            data={{
              total: stats.total,
              resolved: stats.resolved,
              pending: stats.pending,
              rejected: stats.rejected,
            }}
          />
        </div>

        {/* Summary */}
        <DashboardSummary
          total={stats.total}
          resolved={stats.resolved}
        />
      </div>

      {/* 📋 RECENT TABLE */}
      <RecentComplaints complaints={complaints} />
    </div>
  );
};

export default StudentDashboard;