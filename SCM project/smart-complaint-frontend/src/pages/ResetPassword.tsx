import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const resetPassword = () => {
    if (!otp || !password) {
      toast.error("All fields are required");
      return;
    }

    API.post("/api/auth/reset-password", {
      email,
      otp,
      newPassword: password,
    })
      .then(() => {
        toast.success("Password reset successfully!");
        navigate("/auth?mode=login&role=admin");
      })
      .catch(() => {
        toast.error("Invalid OTP or expired");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Reset Password
        </h2>

        <input
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-lg mb-4"
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 border rounded-lg mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={resetPassword}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
