import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const sendOtp = () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    API.post("/api/auth/forgot-password", { email })
      .then(() => {
        toast.success("OTP sent to your email");
        navigate(`/reset-password?email=${email}`);
      })
      .catch(() => {
        toast.error("Email not found");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter registered email"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Send OTP
        </button>

        <p
          className="mt-4 text-center text-blue-600 cursor-pointer underline"
          onClick={() => navigate("/auth?mode=login&role=admin")}
        >
          Back to Login
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
