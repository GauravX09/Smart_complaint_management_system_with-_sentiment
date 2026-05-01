import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getComplaint,
  raiseEmergency,
  deleteComplaint,
} from "../../services/complaintService";

interface Complaint {
  id: number;
  category: string;
  description: string;
  status: string;
  createdAt?: string;
  complaintCode?: string;
  priority?: string;
  location?: string;
}
interface Complaint {
  id: number;
  complaintCode?: string;
  category: string;
  description: string;
  status: string;
  priority?: string;
  location?: string;
  createdAt?: string;

  // ✅ ADD THIS
  imagePath?: string;
  videoPath?: string;
  audioPath?: string;
}

const ComplaintDetails: React.FC = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getComplaint(Number(id));
        setComplaint(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ================= TIMER LOGIC =================
  useEffect(() => {
    if (!complaint?.createdAt) return;

    const interval = setInterval(() => {
      const created = new Date(complaint.createdAt!).getTime();
      const now = new Date().getTime();

      const diff = 24 * 60 * 60 * 1000 - (now - created);

      if (diff <= 0) {
        setRemainingTime("Available now");
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setRemainingTime(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [complaint]);

  // ================= WHATSAPP =================
  const handleWhatsApp = () => {
    if (!complaint) return;

    const text = `Complaint: ${complaint.category}\nDescription: ${complaint.description}\nStatus: ${complaint.status}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // ================= EMERGENCY =================
  const handleEmergency = async () => {
    try {
      const res = await raiseEmergency(Number(id));
      alert(res.data);
    } catch {
      alert("Emergency failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await deleteComplaint(Number(id));
      alert("Deleted successfully");
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!complaint) return <p className="p-6">No data found</p>;

  const emergencyEnabled = remainingTime === "Available now";
  const BASE_URL = "http://localhost:8080";

  return (
    <div className="p-6 grid grid-cols-4 gap-6">

      {/* LEFT */}
      <div className="col-span-3 space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-5 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Complaint #{complaint.complaintCode || complaint.id}
            </h2>
            <p className="text-gray-500 text-sm">
              {complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>

          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
            {complaint.status}
          </span>
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-xl shadow p-5 grid grid-cols-2 gap-6">
          <div>
            <p><b>Category:</b> {complaint.category}</p>
            <p><b>Description:</b> {complaint.description}</p>
            <p><b>Status:</b> {complaint.status}</p>
            <p><b>Location:</b> {complaint.location || "Not Provided"}</p>
            <p><b>Complaint ID:</b> {complaint.id}</p>
            <p><b>Priority:</b> {complaint.priority || "MEDIUM"}</p>
          </div>

          <div>
            <p className="font-semibold">Attached Media</p>
            <div>
              {complaint.imagePath ? (
                <img
                  src={`http://localhost:8080${complaint.imagePath}`}
                  alt="complaint"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              ) : (
                <p>No media</p>
              )}
            </div>
          </div>
        </div>

        {/* LOGS (STATIC FOR NOW) */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-3">Edits History</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Complaint submitted</li>
            <li>• Complaint edited</li>
            <li>• Media updated</li>
          </ul>
        </div>

      </div>

      {/* RIGHT */}
      <div className="space-y-6">

        {/* QUICK ACTION */}
        <div className="bg-white rounded-xl shadow p-5 space-y-3">
          <h3 className="font-semibold">Quick Actions</h3>

          <button
            onClick={handleWhatsApp}
            className="w-full bg-green-200 text-green-800 py-2 rounded"
          >
            Share on WhatsApp
          </button>

          <button className="w-full bg-blue-200 text-blue-800 py-2 rounded">
            Call Department
          </button>

          <button
            onClick={handleEmergency}
            disabled={!emergencyEnabled}
            className={`w-full py-2 rounded ${
              emergencyEnabled
                ? "bg-red-200 text-red-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Arise Emergency
          </button>

          <p className="text-xs text-gray-500">
            {emergencyEnabled
              ? "You can raise emergency now"
              : `Available in: ${remainingTime}`}
          </p>
        </div>

        {/* DELETE */}
        <div className="bg-white rounded-xl shadow p-5">
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            Delete Complaint
          </button>
        </div>

        {/* SUPPORT */}
        <div className="bg-white rounded-xl shadow p-5 text-center">
          <p className="text-sm text-gray-500">Need Help?</p>
          <button className="mt-2 bg-purple-500 text-white px-4 py-2 rounded">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComplaintDetails;