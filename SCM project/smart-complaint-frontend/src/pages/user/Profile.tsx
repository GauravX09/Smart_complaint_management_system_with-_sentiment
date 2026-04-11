import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Edit, Save } from "lucide-react";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const email = localStorage.getItem("email") || "";
  const rawUser = localStorage.getItem("user");

  const initialName =
    rawUser ? JSON.parse(rawUser).name : email.split("@")[0];

  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);

  // Save to localStorage (frontend only for now)
  const handleSave = () => {
    const updatedUser = {
      name,
      email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    toast.success("Profile updated successfully");
    setEditing(false);
  };

  const initials = name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-500">
          Manage your personal information
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 space-y-6">
        
        {/* AVATAR */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {name}
            </h2>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <div className="flex gap-2 mt-1">
              <input
                value={name}
                disabled={!editing}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
              />

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 bg-gray-200 rounded-lg"
                >
                  <Edit size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="px-3 bg-indigo-600 text-white rounded-lg"
                >
                  <Save size={16} />
                </button>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={email}
              disabled
              className="input w-full bg-gray-100"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;