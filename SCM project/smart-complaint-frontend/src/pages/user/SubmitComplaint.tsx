import React, { useState } from "react";
import API from "../../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Video,
  Music,
  User,
  Mail,
  FileText,
  Upload,
} from "lucide-react";

const SubmitComplaint: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Dynamic min length
  const getMinLength = () => {
    if (video || audio) return 150;
    if (image) return 200;
    return 300;
  };

  const handleSubmit = async () => {
    const minLength = getMinLength();

    if (!category) return alert("Please select category");
    if (!description || description.length < minLength) {
      return alert(`Description must be at least ${minLength} characters`);
    }

    const formData = new FormData();
    formData.append("userName", user.name);
    formData.append("userEmail", user.email);
    formData.append("category", category);
    formData.append("description", description);

    if (image) formData.append("image", image);
    if (video) formData.append("video", video);
    if (audio) formData.append("audio", audio);

    try {
      setLoading(true);
            await API.post("/api/complaints/add", formData,);
      alert("Complaint submitted 🚀");
      navigate("/user/my-complaints/total");
    } catch {
      alert("Error submitting complaint ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT FORM ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow p-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FileText className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-600">
                Submit New Complaint
              </h2>
              <p className="text-sm text-gray-500">
                Please provide accurate details to resolve your issue faster.
              </p>
            </div>
          </div>

          {/* USER INFO */}
          <h4 className="font-semibold text-indigo-500 mb-2">Your Information</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center border rounded-lg p-2 bg-gray-50">
              <User size={16} className="mr-2 text-gray-500" />
              <input
                value={user.name}
                disabled
                className="bg-transparent outline-none w-full"
              />
            </div>

            <div className="flex items-center border rounded-lg p-2 bg-gray-50">
              <Mail size={16} className="mr-2 text-gray-500" />
              <input
                value={user.email}
                disabled
                className="bg-transparent outline-none w-full"
              />
            </div>
          </div>

          {/* CATEGORY */}
          <h4 className="font-semibold text-indigo-500 mb-2">
            Complaint Details
          </h4>

          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Select Complaint Category --</option>
            <option>Electricity</option>
            <option>Water</option>
            <option>Internet</option>
            <option>Roads</option>
            <option>Sanitation</option>
            <option>Noise</option>
            <option>Other</option>
            <option>Faculty</option>
            <option>Infrastructure</option>
            <option>Ragging</option>
            <option>Smoking</option>
            <option>Documentations</option>
            <option>Garbage</option>
            <option>Missbehaviour</option>
          </select>

          {/* DESCRIPTION */}
          <textarea
            placeholder="Provide as much detail as possible about your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            className="w-full border p-3 rounded-xl h-32 focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Minimum required: {getMinLength()} chars</span>
            <span>{description.length}/1000</span>
          </div>

          {/* MEDIA */}
          <p className="mt-4 text-sm font-semibold text-indigo-500">
            Add Supporting Media (Optional)
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Upload images, videos or audio to help better understand the issue.
          </p>

          <div className="grid grid-cols-3 gap-4">

            {/* IMAGE */}
            <label className="border rounded-xl p-4 text-center cursor-pointer hover:bg-indigo-50 transition">
              <ImageIcon className="mx-auto mb-2 text-indigo-500" />
              <p className="text-sm font-semibold">Upload Image</p>
              <p className="text-xs text-gray-400">PNG, JPG (Max 5MB)</p>
              <input hidden type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
              <p className="text-xs mt-1">{image?.name || "Choose File"}</p>
            </label>

            {/* VIDEO */}
            <label className="border rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50 transition">
              <Video className="mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-semibold">Upload Video</p>
              <p className="text-xs text-gray-400">MP4 (Max 20MB)</p>
              <input hidden type="file" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
              <p className="text-xs mt-1">{video?.name || "Choose File"}</p>
            </label>

            {/* AUDIO */}
            <label className="border rounded-xl p-4 text-center cursor-pointer hover:bg-green-50 transition">
              <Music className="mx-auto mb-2 text-green-500" />
              <p className="text-sm font-semibold">Upload Audio</p>
              <p className="text-xs text-gray-400">MP3 (Max 10MB)</p>
              <input hidden type="file" onChange={(e) => setAudio(e.target.files?.[0] || null)} />
              <p className="text-xs mt-1">{audio?.name || "Choose File"}</p>
            </label>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-xl text-white font-semibold
              bg-gradient-to-r from-indigo-500 to-pink-500
              ${loading ? "opacity-60" : "hover:scale-105"}
              transition`}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </motion.div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="space-y-4">

          {/* Tips */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h4 className="font-semibold mb-2">💡 Before You Submit</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✔ Be clear & detailed</li>
              <li>✔ Add supporting evidence</li>
              <li>✔ Track updates later</li>
              <li>✔ Follow guidelines</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h4 className="font-semibold mb-2">⚡ Quick Actions</h4>
            <button className="w-full p-2 rounded bg-green-100 mb-2">
              View My Complaints
            </button>
            <button className="w-full p-2 rounded bg-blue-100 mb-2">
              Share Complaint Link
            </button>
            <button className="w-full p-2 rounded bg-purple-100">
              Help & Support
            </button>
          </div>

          {/* Emergency */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h4 className="font-semibold text-red-600 mb-2">🚨 Emergency?</h4>
            <p className="text-xs text-gray-600 mb-2">
              For urgent issues, raise an emergency complaint.
            </p>
            <button className="w-full bg-red-500 text-white p-2 rounded">
              Raise Emergency
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;