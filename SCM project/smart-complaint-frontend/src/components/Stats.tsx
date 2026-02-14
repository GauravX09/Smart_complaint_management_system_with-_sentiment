import React from "react";
import { motion } from "framer-motion";

type StatItem = {
  value: string;
  label: string;
};

const StatCard: React.FC<StatItem> = ({ value, label }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    transition={{ duration: 0.2 }}
    className="bg-indigo-600 text-white p-6 rounded-xl text-center shadow"
  >
    <div className="text-3xl font-bold">{value}</div>
    <div className="mt-1 text-sm">{label}</div>
  </motion.div>
);

type StatsProps = {
  data?: StatItem[];
};

const Stats: React.FC<StatsProps> = ({ data }) => {
  const defaultStats: StatItem[] = [
    { value: "0", label: "Total Complaints" },
    { value: "0", label: "Pending Complaints" },
    { value: "0", label: "Resolved Complaints" },
    { value: "0", label: "Total Users" },
    { value: "0", label: "Total Admins" },
  ];

  const stats = data && data.length > 0 ? data : defaultStats;

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <StatCard key={i} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
