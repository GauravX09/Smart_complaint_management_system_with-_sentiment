import React, { useEffect, useState } from "react";
import API from "../../services/api";

interface Complaint {
  id: number;
  userName: string;
  userEmail: string;
  category: string;
  description: string;
  status: string;
  createdAt?: string;
  imagePath?: string;
  videoPath?: string;
  audioPath?: string;
}

const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/api/complaints/all");
      setComplaints(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await API.put(`/api/complaints/${id}/status?status=${status}`);
    fetchComplaints();
  };

  const deleteComplaint = async (id: number) => {
    if (!window.confirm("Delete this complaint permanently?")) return;
    await API.delete(`/api/complaints/${id}`);
    fetchComplaints();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Manage Complaints
      </h2>

      {loading && <p>Loading complaints...</p>}

      {!loading && (
        <table className="w-full border bg-white rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Media</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td className="p-2 border">
                  {c.userName}
                  <br />
                  <span className="text-xs text-gray-500">
                    {c.userEmail}
                  </span>
                </td>

                <td className="p-2 border">{c.category}</td>
                <td className="p-2 border">{c.description}</td>

                {/* MEDIA */}
                <td className="p-2 border space-y-2">
                  {c.imagePath && (
                    <img
                      src={`http://localhost:8080${c.imagePath}`}
                      className="w-20 rounded"
                    />
                  )}
                  {c.videoPath && (
                    <video
                      src={`http://localhost:8080${c.videoPath}`}
                      controls
                      className="w-32"
                    />
                  )}
                  {c.audioPath && (
                    <audio
                      src={`http://localhost:8080${c.audioPath}`}
                      controls
                    />
                  )}
                </td>

                {/* STATUS */}
                <td className="p-2 border">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateStatus(c.id, e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>

                {/* DELETE */}
                <td className="p-2 border">
                  <button
                    onClick={() => deleteComplaint(c.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminComplaints;
