import { motion } from "framer-motion";
import StatCard from "../ui/StatCard";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface StatsOverviewProps {
  total: number;
  resolved: number;
  pending: number;
  rejected: number;
}

const StatsOverview = ({
  total,
  resolved,
  pending,
  rejected,
}: StatsOverviewProps) => {
  const stats = [
    {
      title: "Total Complaints",
      value: total,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;