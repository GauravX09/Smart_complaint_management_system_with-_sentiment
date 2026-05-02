import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

interface Complaint {
  id: number;
  category: string;
  description: string;
  status: string;
  sentimentScore: number;
  userEmail: string;
}

const getPriority = (score: number) => {
  if (score >= 0.75) return "HIGH";
  if (score >= 0.4) return "MEDIUM";
  return "LOW";
};

const AdminComplaintDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [media, setMedia] = useState<File | null>(null);

  const fetchComplaint = async () => {
    try {
      const res = await API.get(`/api/complaints/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, []);

  const resolveComplaint = async () => {
    await API.put(`/api/complaints/${id}/status?status=RESOLVED`);
    alert("Complaint resolved & email sent!");
    fetchComplaint();
  };

  const handleUpload = async () => {
    if (!media) return;

    const formData = new FormData();
    formData.append("file", media);

    await API.post(`/api/complaints/${id}/upload`, formData);
    alert("Proof uploaded");
  };

  if (loading) return <Loader />;
  if (!data) return <div>No data</div>;

  const priority = getPriority(data.sentimentScore);

  return (
     <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="p-6"
  >
    
  <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
    
   
    {/* ================= HEADER ================= */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center overflow-hidden">
    
      {/* Glow effect */}
      <div className="absolute inset-0 bg-white/10 blur-2xl opacity-20"></div>
    
      <div className="relative">
        <h1 className="text-2xl font-bold tracking-wide">
          Complaint #{data.id}
        </h1>
        <p className="text-sm opacity-80">Manage complaint & take action</p>
      </div>
    
      <button
        onClick={resolveComplaint}
        className="relative bg-green-500 px-5 py-2 rounded-xl shadow hover:scale-105 transition"
      >
        Resolve Complaint
      </button>
    </div>

    {/* ================= MAIN GRID ================= */}
    <div className="grid grid-cols-3 gap-6">

      {/* ================= LEFT ================= */}
    <div className="col-span-3 space-y-6">

        {/* Complaint Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="font-semibold mb-4">Complaint Information</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><b>Category:</b> {data.category}</p>
            <p><b>Status:</b> {data.status}</p>
            <p><b>Email:</b> {data.userEmail}</p>
            <p>
              <b>Priority:</b>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded ${
                  priority === "HIGH"
                    ? "bg-red-100 text-red-600"
                    : priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                   }`}
                >
                {priority}
              </span>
            </p>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">{data.description}</p>
          </div>
        </div>

        {/* Admin Note */}
        <div className="bg-white p-6 rounded-2xl shadow border">
        
          <h3 className="font-semibold mb-3">Admin Note</h3>
        
          <div className="relative">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Write professional admin note..."
            />
        
            <button className="absolute bottom-3 right-3 bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-indigo-700">
              Save
            </button>
          </div>
        
        </div>
    </div>

        {/* Upload Proof */}
     <div className="bg-white p-6 rounded-2xl shadow border border-dashed text-center hover:border-indigo-400 transition">

      <h3 className="font-semibold mb-3">Upload Proof</h3>
    
      <p className="text-gray-500 text-sm mb-3">
        Drag & drop or upload image/video proof
      </p>
    
      <input
        type="file"
        onChange={(e) => setMedia(e.target.files?.[0] || null)}
        className="mb-3"
      />
    
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Upload
      </button>
    
    </div> 
        {media && (
      <div className="mt-4 bg-white p-4 rounded-xl shadow">
        <p className="text-sm text-gray-500 mb-2">Preview:</p>
    
        <img
          src={URL.createObjectURL(media)}
          alt="preview"
          className="w-40 h-32 object-cover rounded-lg"
        />
      </div>
    )}

    </div>

      {/* ================= RIGHT ================= */}
      <div className="space-y-6">

        {/* Sentiment */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
        
          <h3 className="font-semibold mb-4">Sentiment Analysis</h3>
        
          <div className="relative w-28 h-28 mx-auto">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle
                cx="50%"
                cy="50%"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45"
                stroke="#ef4444"
                strokeWidth="8"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * data.sentimentScore)}
              />
            </svg>
        
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-red-500">
              {Math.round(data.sentimentScore * 100)}%
            </div>
          </div>
        
          <p className="text-xs text-red-500 mt-3">
            ⚠ High negative sentiment detected
          </p>
        </div>

        {/* AI Summary */}
         <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow border">
        
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🤖 AI Summary
          </h3>
        
          <p className="text-sm text-gray-600 leading-relaxed">
            This complaint indicates dissatisfaction related to{" "}
            <b>{data.category}</b>. Immediate action is recommended to improve
            system reliability and user experience.
          </p>
        
          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="bg-red-100 text-red-600 px-2 py-1 text-xs rounded">
              Risk Issue
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded">
              Needs Attention
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="font-semibold mb-4">Timeline</h3>
        
          <div className="space-y-3 text-sm">
            <p className="text-green-600">● Submitted</p>
            <p className="text-blue-600">● In Progress</p>
            <p className="text-gray-400">● Resolved</p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-semibold">Quick Actions</h3>

          <button
            onClick={resolveComplaint}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium shadow-lg hover:scale-[1.02] transition"
          >
            Resolve & Send Email
          </button>
        </div>

      </div>

    </div>

</motion.div>
 
);
};

export default AdminComplaintDetails;