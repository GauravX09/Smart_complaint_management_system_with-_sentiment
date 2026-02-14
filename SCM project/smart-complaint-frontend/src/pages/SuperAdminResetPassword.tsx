import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

const SuperAdminResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/super-admin/reset-password",
        {
          token,
          password,
        }
      );

      toast.success("Password updated successfully");
      navigate("/super-admin/login");

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Reset failed");
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
          Super Admin – Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SuperAdminResetPassword;
