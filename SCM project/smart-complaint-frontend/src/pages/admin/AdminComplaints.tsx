import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";

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
  const [search, setSearch] = useState("");

  // ================= FETCH =================
  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const email =
        localStorage.getItem("userEmail") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.email ||
        JSON.parse(localStorage.getItem("admin") || "{}")?.email;

      if (!email) return;

      const res = await API.get(`/api/complaints/admin?email=${email}`);
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

  // ================= FILTER =================
  const filtered = complaints.filter((c) =>
    c.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Department Complaints
          </h2>
          <p className="text-sm text-gray-500">
            Manage and track all complaints
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        <table className="w-full text-sm">

          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th>Email</th>
              <th>Category</th>
              <th>Status</th>
              <th>Sentiment</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-4 font-medium text-gray-700">
                  #{c.id}
                </td>

                <td className="text-gray-600">{c.userEmail}</td>

                <td>
                  <span className="px-2 py-1 text-xs rounded bg-indigo-50 text-indigo-600">
                    {c.category}
                  </span>
                </td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "RESOLVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                {/* SENTIMENT */}
                <td>
                  <span
                    className={`text-xs font-semibold ${
                      c.sentiment === "NEGATIVE"
                        ? "text-red-600"
                        : c.sentiment === "POSITIVE"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {c.sentiment}
                  </span>
                </td>

                {/* SCORE */}
                <td className="text-gray-700 font-medium">
                  {(c.sentimentScore * 100).toFixed(1)}%
                </td>

                {/* ACTIONS */}
                <td className="space-x-2">

                  <button
                    onClick={() => updateStatus(c.id, "RESOLVED")}
                    className="px-3 py-1 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => updateStatus(c.id, "PENDING")}
                    className="px-3 py-1 text-xs rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
                  >
                    Pending
                  </button>

                  <button className="px-3 py-1 text-xs rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition">
                    Open
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
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