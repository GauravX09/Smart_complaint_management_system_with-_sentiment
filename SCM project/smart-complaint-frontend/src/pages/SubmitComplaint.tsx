import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Upload, Trash2, Eye } from "lucide-react";

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

  // ================= LOAD USER =================
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // ================= MEDIA HANDLING =================
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

  // ================= SUBMIT =================
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

      // ❌ DO NOT set Content-Type manually
      await API.post("/api/complaints/add", formData);

      toast.success("Complaint submitted successfully");

      // cleanup object URLs
      mediaFiles.forEach((m) => URL.revokeObjectURL(m.url));

      setCategory("");
      setDescription("");
      setMediaFiles([]);

      // ✅ CORRECT ROUTE
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
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-indigo-700">
        Submit New Complaint
      </h2>

      {!user ? (
        <p className="text-red-600">Please login to submit a complaint.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USER INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={user.name}
              disabled
              className="input bg-gray-100"
            />
            <input
              value={user.email}
              disabled
              className="input bg-gray-100"
            />
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
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* DESCRIPTION */}
          <textarea
            className="input w-full"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {/* MEDIA UPLOAD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["image", "video", "audio"] as MediaType[]).map((type) => (
              <label
                key={type}
                className="border rounded-lg p-4 cursor-pointer text-center hover:bg-indigo-50"
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
                <div className="text-xs text-gray-500 mt-1">
                  {hasType(type) ? "File selected" : "No file"}
                </div>
              </label>
            ))}
          </div>

          {/* FILE LIST */}
          {mediaFiles.map((m) => (
            <div
              key={m.type}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span>{m.file.name}</span>
              <div className="flex gap-3">
                <a href={m.url} target="_blank" rel="noreferrer">
                  <Eye size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => removeFile(m.type)}
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitComplaint;
