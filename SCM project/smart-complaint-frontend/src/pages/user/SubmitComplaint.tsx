import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Upload, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface User {
  name: string;
  email: string;
}

type MediaType = "image" | "video" | "audio";

interface MediaFile {
  file: File;
  url: string;
  type: MediaType;
}

const CATEGORIES = [
  "Transportation",
  "Drinking Water",
  "Class",
  "Electricity",
  "Garbage",
  "Faculty",
  "Misbehavior",
  "Ragging",
  "Smoking",
  "Documentation",
];

const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED USER LOAD (IMPORTANT)
  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const email = localStorage.getItem("email");

    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        setUser(null);
      }
    } else if (email) {
      // 🔥 fallback if user object not stored
      setUser({
        name: email.split("@")[0],
        email: email,
      });
    }
  }, []);

  // ================= MEDIA =================
  const handleFileUpload = (file: File, type: MediaType) => {
    const url = URL.createObjectURL(file);

    setMediaFiles((prev) => [
      ...prev.filter((m) => m.type !== type),
      { file, url, type },
    ]);

    toast.success(`${type.toUpperCase()} selected`);
  };

  const removeFile = (type: MediaType) => {
    setMediaFiles((prev) => {
      const toRemove = prev.find((m) => m.type === type);
      if (toRemove) URL.revokeObjectURL(toRemove.url);
      return prev.filter((m) => m.type !== type);
    });
    toast.info("File removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (!category || !description.trim()) {
      toast.error("Category and description are mandatory");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userName", user.name);
      formData.append("userEmail", user.email);
      formData.append("category", category);
      formData.append("description", description.trim());

      mediaFiles.forEach((m) => {
        formData.append(m.type, m.file);
      });

      await API.post("/api/complaints/add", formData);

      toast.success("Complaint submitted successfully");

      mediaFiles.forEach((m) => URL.revokeObjectURL(m.url));

      setCategory("");
      setDescription("");
      setMediaFiles([]);

      navigate("/user/my-complaints/total");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const hasType = (t: MediaType) => mediaFiles.some((m) => m.type === t);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-indigo-600">
        🚀 Submit New Complaint
      </h2>

      {!user ? (
        <div className="text-center text-red-500">
          Please login to submit a complaint.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* USER INFO */}
          <div className="grid md:grid-cols-2 gap-4">
            <input value={user.name} disabled className="input bg-gray-100" />
            <input value={user.email} disabled className="input bg-gray-100" />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input w-full"
            required
          >
            <option value="">Select Complaint Category</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* DESCRIPTION */}
          <textarea
            className="input w-full"
            rows={5}
            placeholder="Describe your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* MEDIA */}
          <div className="grid md:grid-cols-3 gap-4">
            {(["image", "video", "audio"] as MediaType[]).map((type) => (
              <label
                key={type}
                className="border rounded-xl p-4 cursor-pointer text-center hover:bg-indigo-50 transition"
              >
                <Upload className="mx-auto mb-2" />
                Upload {type}
                <input
                  type="file"
                  hidden
                  accept={
                    type === "image"
                      ? "image/*"
                      : type === "video"
                      ? "video/*"
                      : "audio/*"
                  }
                  onChange={(e) =>
                    e.target.files &&
                    handleFileUpload(e.target.files[0], type)
                  }
                />
                <div className="text-xs mt-1">
                  {hasType(type) ? "Selected ✅" : "No file"}
                </div>
              </label>
            ))}
          </div>

          {/* FILE LIST */}
          {mediaFiles.map((m) => (
            <div
              key={m.type}
              className="flex justify-between items-center border p-3 rounded-lg"
            >
              <span>{m.file.name}</span>
              <div className="flex gap-3">
                <a href={m.url} target="_blank">
                  <Eye size={18} />
                </a>
                <button type="button" onClick={() => removeFile(m.type)}>
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default SubmitComplaint;