import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  Activity,
  TrendingUp,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AlertSentiment: React.FC = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* ================= HEADER ================= */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="text-red-500" />
          Alert & Sentiment Analysis
        </h1>
        <p className="text-gray-500 mt-1">
          AI-driven sentiment insights & critical alerts
        </p>
      </motion.div>

      {/* ================= KPI CARDS ================= */}
      <motion.div
        variants={container}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Kpi
          title="Positive"
          value={65}
          icon={<Smile />}
          color="green"
        />
        <Kpi
          title="Neutral"
          value={20}
          icon={<Meh />}
          color="yellow"
        />
        <Kpi
          title="Nega­tive"
          value={15}
          icon={<Frown />}
          color="red"
        />
      </motion.div>

      {/* ================= DISTRIBUTION ================= */}
      <motion.div
        variants={item}
        className="bg-white/80 backdrop-blur rounded-2xl shadow p-6"
      >
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Activity size={18} /> Sentiment Distribution
        </h2>

        <div className="mt-6 space-y-5">
          <Progress label="Positive" value={65} color="bg-green-500" />
          <Progress label="Neutral" value={20} color="bg-yellow-400" />
          <Progress label="Negative" value={15} color="bg-red-500" />
        </div>
      </motion.div>

      {/* ================= ALERTS ================= */}
      <motion.div
        variants={item}
        className="bg-white/80 backdrop-blur rounded-2xl shadow p-6"
      >
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <TrendingUp size={18} /> Recent Alerts
        </h2>

        <div className="mt-5 space-y-4">
          <AlertRow
            text="High negative sentiment detected in Hostel complaints"
            level="HIGH"
          />
          <AlertRow
            text="Repeated complaints from Engineering department"
            level="MEDIUM"
          />
          <AlertRow
            text="Overall system sentiment stable this week"
            level="LOW"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlertSentiment;

/* ================= COMPONENTS ================= */

const Kpi = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "green" | "yellow" | "red";
}) => {
  const map = {
    green: "from-green-100 to-green-50 text-green-700",
    yellow: "from-yellow-100 to-yellow-50 text-yellow-700",
    red: "from-red-100 to-red-50 text-red-700",
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.04 }}
      className={`rounded-2xl p-6 bg-gradient-to-br ${map[color]} shadow flex justify-between items-center`}
    >
      <div>
        <p className="text-sm uppercase tracking-wide">{title}</p>
        <p className="text-4xl font-bold">{value}%</p>
      </div>
      <div className="p-3 bg-white rounded-full shadow">
        {icon}
      </div>
    </motion.div>
  );
};

const Progress = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>

    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1 }}
        className={`h-2 ${color} rounded-full`}
      />
    </div>
  </div>
);

const AlertRow = ({
  text,
  level,
}: {
  text: string;
  level: "HIGH" | "MEDIUM" | "LOW";
}) => {
  const styles = {
    HIGH: "bg-red-100 text-red-700 animate-pulse",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
    >
      <span className="text-gray-700">{text}</span>
      <span
        className={`px-3 py-1 text-xs rounded-full font-semibold ${styles[level]}`}
      >
        {level}
      </span>
    </motion.div>
  );
};
