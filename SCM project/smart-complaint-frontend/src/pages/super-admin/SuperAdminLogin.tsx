import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/super-admin/auth/login",
        { email: form.email, password: form.password }
      );

      const data = res.data || {};

      // ✅ STORE AUTH DATA
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "SUPER_ADMIN");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name || "Super Admin",
          email: form.email,
          role: "SUPER_ADMIN",
        })
      );

      toast.success("Super Admin login successful");

      navigate("/super-admin/dashboard");

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Super Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "Login as Super Admin"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SuperAdminLogin;
