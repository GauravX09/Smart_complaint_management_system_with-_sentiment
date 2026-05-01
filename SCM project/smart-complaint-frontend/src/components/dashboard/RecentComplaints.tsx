import { motion } from "framer-motion";
import  Card  from "../ui/Card";
import  Badge  from "../ui/Badge";

interface Complaint {
  id: number;
  category: string;
  description: string;
  status: "RESOLVED" | "PENDING" | "REJECTED";
  date: string;
}

interface RecentComplaintsProps {
  complaints: Complaint[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "RESOLVED":
      return "bg-green-100 text-green-600";
    case "PENDING":
      return "bg-yellow-100 text-yellow-600";
    case "REJECTED":
      return "bg-red-100 text-red-600";
    default:
      return "";
  }
};

const RecentComplaints = ({ complaints }: RecentComplaintsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="p-6 rounded-2xl shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Complaints</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">#</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">
                    No complaints found
                  </td>
                </tr>
              ) : (
                complaints.map((c, index) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3">{index + 1}</td>
                    <td>{c.category}</td>
                    <td className="max-w-xs truncate">{c.description}</td>
                    <td>
                      <span className={getStatusColor(c.status)}>
                        {c.status}
                      </span>
                    </td>
                    <td>{c.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
};

export default RecentComplaints;