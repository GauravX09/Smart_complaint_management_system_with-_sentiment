import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";

interface Complaint {
  id: number;
  userName: string;
  userEmail: string;
  category: string;
  description: string;
  status: string;
  createdAt?: string;

  // ✅ MEDIA PATHS
  imagePath?: string;
  videoPath?: string;
  audioPath?: string;
}

interface StoredUser {
  email: string;
}

type TabType = "TOTAL" | "PENDING" | "RESOLVED" | "REJECTED";

const MyComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("TOTAL");

  // ================= FETCH USER COMPLAINTS =================
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    let user: StoredUser;
    try {
      user = JSON.parse(stored) as StoredUser;
    } catch {
      setError("Invalid user data.");
      setLoading(false);
      return;
    }

    if (!user.email) {
      setError("User email missing.");
      setLoading(false);
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await API.get(`/api/complaints/user/${user.email}`);
        setComplaints(res.data || []);
      } catch {
        setError("Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // ================= FILTER =================
  const filteredComplaints = useMemo(() => {
    if (activeTab === "TOTAL") return complaints;
    return complaints.filter(
      (c) => c.status?.toUpperCase() === activeTab
    );
  }, [complaints, activeTab]);

  const statusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= UI =================
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        My Complaints
      </h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {(["TOTAL", "PENDING", "RESOLVED", "REJECTED"] as TabType[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {loading && <p>Loading your complaints...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && filteredComplaints.length === 0 && (
        <p>No complaints found.</p>
      )}

      {!loading && !error && filteredComplaints.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Media</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((c) => (
              <tr key={c.id}>
                <td className="p-2 border">{c.category}</td>
                <td className="p-2 border">{c.description}</td>

                {/* ✅ MEDIA PREVIEW */}
                <td className="p-2 border space-y-2">
                  {c.imagePath && (
                    <img
                      src={`http://localhost:8080${c.imagePath}`}
                      alt="complaint"
                      className="w-20 h-20 object-cover rounded cursor-pointer"
                      onClick={() =>
                        window.open(
                          `http://localhost:8080${c.imagePath}`,
                          "_blank"
                        )
                      }
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

                <td className="p-2 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusBadge(
                      c.status
                    )}`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="p-2 border">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyComplaints;
