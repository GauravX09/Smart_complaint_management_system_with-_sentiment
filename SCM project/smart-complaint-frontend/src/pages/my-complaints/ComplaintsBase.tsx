import React, { useEffect, useState } from "react";
import API from "../../services/api";

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
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) return <p>Loading...</p>;

  if (complaints.length === 0)
    return <p>No complaints found.</p>;

  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Category</th>
          <th className="p-2 border">Description</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Submitted</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map((c) => (
          <tr key={c.id}>
            <td className="p-2 border">{c.category}</td>
            <td className="p-2 border">{c.description}</td>
            <td className="p-2 border">{c.status}</td>
            <td className="p-2 border">
              {c.createdAt
                ? new Date(c.createdAt).toLocaleString()
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ComplaintsBase;
