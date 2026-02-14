import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const CreateAdmin: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createAdmin = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    API.post("/api/auth/create-admin", {
      name: form.name,
      email: form.email,
      password: form.password,
      role: "ADMIN",
    })
      .then(() => {
        toast.success("New Admin Created Successfully!");
        navigate("/admin/dashboard");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to create admin (email may already exist)");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Create New Admin
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-6"
          onChange={handleChange}
        />

        <button
          onClick={createAdmin}
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Create Admin
        </button>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="w-full mt-3 text-blue-600 underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default CreateAdmin;
