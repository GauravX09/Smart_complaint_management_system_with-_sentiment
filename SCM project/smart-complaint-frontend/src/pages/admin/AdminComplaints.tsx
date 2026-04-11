import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

interface Complaint {
  id: number;
  userEmail: string;
  category: string;
  status: string;
  description: string;
  sentiment: string;
  sentimentScore: number;
}

const AdminComplaints: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // ================= FETCH =================

     
          const fetchComplaints = async () => {
            try {
              setLoading(true);
          
              // 🔥 DEBUG ALL STORAGE
              console.log("LOCAL STORAGE:", localStorage);
          
              // 🔥 Try multiple keys (safe approach)
              let email =
                localStorage.getItem("userEmail") ||
                JSON.parse(localStorage.getItem("user") || "{}")?.email ||
                JSON.parse(localStorage.getItem("admin") || "{}")?.email;
          
              console.log("Extracted Email:", email);
          
              if (!email) {
                alert("Email not found in localStorage");
                return;
              }
          
              const res = await API.get(
                `/api/complaints/admin?email=${email}`
              );
          
              console.log("API DATA:", res.data);
          
              setComplaints(res.data || []);
            } catch (err) {
              console.error("Error fetching complaints", err);
            } finally {
              setLoading(false);
            }
          };
          

  
        

  // ================= UPDATE STATUS =================
  const updateStatus = async (id: number, status: string) => {
    try {
      await API.put(`/api/complaints/${id}/status?status=${status}`);
      fetchComplaints();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h2 className="text-2xl font-bold text-gray-700">
        📋 Department Complaints
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Sentiment</th>
              <th className="p-3">Score</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <motion.tr
                key={c.id}
                whileHover={{ scale: 1.01 }}
                className={`border-b 
                  ${
                    c.sentiment === "NEGATIVE"
                      ? "bg-red-50"
                      : "bg-white"
                  }`}
              >
                <td className="p-3 font-medium">{c.id}</td>
                <td className="p-3">{c.userEmail}</td>
                <td className="p-3">{c.category}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      c.status === "RESOLVED"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                {/* SENTIMENT */}
                <td className="p-3 font-semibold">
                  {c.sentiment}
                </td>

                <td className="p-3">
                  {(c.sentimentScore * 100).toFixed(1)}%
                </td>

                {/* ACTIONS */}
                <td className="p-3 space-x-2">

                  {/* RESOLVE */}
                  <button
                    onClick={() => updateStatus(c.id, "RESOLVED")}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Resolve
                  </button>

                  {/* PENDING */}
                  <button
                    onClick={() => updateStatus(c.id, "PENDING")}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Pending
                  </button>

                  {/* OPEN (future page) */}
                  <button className="px-3 py-1 bg-blue-500 text-white rounded">
                    Open
                  </button>

                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaints;