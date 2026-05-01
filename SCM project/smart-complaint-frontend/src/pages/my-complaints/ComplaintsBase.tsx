import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Complaint {
  id: number;
  category: string;
  description: string;
  status: string;
  createdAt?: string;
}

interface Props {
  statusFilter?: "PENDING" | "RESOLVED" | "REJECTED";
}

const ComplaintsBase: React.FC<Props> = ({ statusFilter }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user = JSON.parse(stored);

    API.get(`/api/complaints/user/${user.email}`)
      .then((res) => {
        const data = statusFilter
          ? res.data.filter(
              (c: Complaint) =>
                c.status?.toUpperCase() === statusFilter
            )
          : res.data;

        setComplaints(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) return <p className="p-4">Loading...</p>;

  if (complaints.length === 0)
    return <p className="p-4">No complaints found.</p>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Description</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Submitted</th>
            <th className="p-3 border text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-gray-50 transition"
            >
              <td className="p-3 border">{c.category}</td>

              <td className="p-3 border text-gray-600">
                {c.description}
              </td>

              <td className="p-3 border">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    c.status === "RESOLVED"
                      ? "bg-green-100 text-green-600"
                      : c.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {c.status}
                </span>
              </td>

              <td className="p-3 border">
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString()
                  : "—"}
              </td>

              {/* 🔥 OPEN BUTTON */}
              <td className="p-3 border text-center">
                <button
                  onClick={() =>
                    navigate(`/user/complaints/${c.id}`)
                  }
                  className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-600 hover:scale-105 transition"
                >
                  Open
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsBase;