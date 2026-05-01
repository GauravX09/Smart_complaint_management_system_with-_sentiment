import { motion } from "framer-motion";
import Card from "../ui/Card";

interface DashboardSummaryProps {
  total: number;
  resolved: number;
}

const DashboardSummary = ({ total, resolved }: DashboardSummaryProps) => {
  const successRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Summary</h2>

        <div className="space-y-4">
          {/* Total */}
          <div>
            <p className="text-sm text-gray-500">Total Complaints</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          {/* Success Rate */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Success Rate</p>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                style={{ width: `${successRate}%` }}
              />
            </div>

            <p className="text-sm mt-2 font-medium">{successRate}%</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DashboardSummary;