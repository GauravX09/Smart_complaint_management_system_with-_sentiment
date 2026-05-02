import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

interface Complaint {
  id: number;
  userEmail: string;
  category: string;
  status: string;
  description: string;
  sentiment: string;
  sentimentScore: number;
}

const getPriority = (score: number) => {
  if (score >= 0.75) return "HIGH";
  if (score >= 0.4) return "MEDIUM";
  return "LOW";
};

const priorityWeight: any = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const AdminComplaints: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const email =
        localStorage.getItem("userEmail") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email ||
        JSON.parse(localStorage.getItem("admin") || "{}")?.email;

      const res = await API.get(`/api/complaints/admin?email=${email}`);
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const updateStatus = async (id: number, status: string) => {
    await API.put(`/api/complaints/${id}/status?status=${status}`);
    fetchComplaints();
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <Loader />;

  // ================= FILTER + SORT =================
  const filtered = complaints
    .map((c) => ({
      ...c,
      priority: getPriority(c.sentimentScore),
    }))
    .filter((c) =>
      c.userEmail.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) =>
      statusFilter === "ALL" ? true : c.status === statusFilter
    )
    .filter((c) =>
      priorityFilter === "ALL" ? true : c.priority === priorityFilter
    )
    .sort(
      (a, b) =>
        priorityWeight[b.priority] - priorityWeight[a.priority]
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 p-5 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-xl font-semibold">Admin Complaints</h2>
          <p className="text-sm opacity-80">
            Smart complaint monitoring system
          </p>
        </div>

        <input
          placeholder="Search email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-4">

        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <select
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="ALL">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">ID</th>
              <th>Email</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Sentiment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">

                <td className="p-4 font-semibold">#{c.id}</td>

                <td>{c.userEmail}</td>

                <td>
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                    {c.category}
                  </span>
                </td>

                {/* PRIORITY */}
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.priority === "HIGH"
                        ? "bg-red-100 text-red-600"
                        : c.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {c.priority}
                  </span>
                </td>

                {/* STATUS */}
                <td>
                  <span className="text-xs px-2 py-1 rounded bg-gray-200">
                    {c.status}
                  </span>
                </td>

                {/* SENTIMENT */}
                <td>
                  <span className="font-semibold">
                    {(c.sentimentScore * 100).toFixed(0)}%
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="space-x-2">

                  <button
                    onClick={() => navigate(`/admin/complaints/${c.id}`)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:scale-105 transition"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => updateStatus(c.id, "RESOLVED")}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Resolve
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No complaints found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;