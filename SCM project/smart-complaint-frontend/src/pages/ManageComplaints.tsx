import React, { useEffect, useState } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

interface Complaint {
  id: number;
  userName: string;
  userEmail: string;
  category: string;
  description: string;
  status: string;
  createdAt?: string | null;
}

const ManageComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load complaints on mount & refresh
  useEffect(() => {
    fetchAll();
  }, [refreshKey]);

  // ------------------------------------------
  // FETCH ALL COMPLAINTS (Admin only)
  // ------------------------------------------
  const fetchAll = async () => {
    try {
      setLoading(true);

      // 🔐 Uses Axios with automatic JWT header
      const res = await API.get<Complaint[]>("/api/complaints/all");

      setComplaints(res.data || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // UPDATE STATUS (Admin only)
  // ------------------------------------------
  const updateStatus = async (id: number, status: string) => {
    try {
      await API.put(`/api/complaints/update-status/${id}`, { status });

      toast.success(`Status updated to "${status}"`);

      // Update in UI immediately
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // ------------------------------------------
  // DELETE COMPLAINT (Admin only)
  // ------------------------------------------
  const deleteComplaint = async (id: number) => {
    if (!window.confirm("Delete this complaint permanently?")) return;

    try {
      await API.delete(`/api/complaints/delete/${id}`);

      toast.success("Complaint deleted");

      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ------------------------------------------
  // UI Rendering
  // ------------------------------------------
  if (loading) return <Loader />;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">Manage Complaints</h2>

        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-2 border text-sm">{c.id}</td>
                <td className="p-2 border text-sm">{c.userName}</td>
                <td className="p-2 border text-sm">{c.userEmail}</td>
                <td className="p-2 border text-sm">{c.category}</td>
                <td className="p-2 border text-sm max-w-xs">
                  {c.description}
                </td>
                <td className="p-2 border text-sm">
                  <span
                    className={`px-2 py-1 rounded font-semibold ${
                      c.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : c.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-2 border text-sm">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                </td>
                <td className="p-2 border text-sm space-x-2">
                  <button
                    onClick={() => updateStatus(c.id, "Resolved")}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => updateStatus(c.id, "In Progress")}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() => updateStatus(c.id, "Pending")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() => deleteComplaint(c.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {complaints.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageComplaints;
