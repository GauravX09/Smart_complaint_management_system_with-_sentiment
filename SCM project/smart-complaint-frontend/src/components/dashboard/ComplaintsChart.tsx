import Card  from "../ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Props {
  data: {
    total: number;
    resolved: number;
    pending: number;
    rejected: number;
  };
}

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

const ComplaintsChart = ({ data }: Props) => {
  const barData = [
    { name: "Total", value: data.total },
    { name: "Pending", value: data.pending },
    { name: "Resolved", value: data.resolved },
    { name: "Rejected", value: data.rejected },
  ];

  const pieData = [
    { name: "Resolved", value: data.resolved },
    { name: "Pending", value: data.pending },
    { name: "Rejected", value: data.rejected },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* 🔵 BAR CHART */}
      <Card className="p-5 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Complaint Statistics</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#7C3AED" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 🟣 PIE CHART */}
      <Card className="p-5 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">User Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={90}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

    </div>
  );
};

export default ComplaintsChart;