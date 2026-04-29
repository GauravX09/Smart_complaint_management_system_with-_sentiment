import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ ROLE FROM URL
  const query = new URLSearchParams(location.search);
  const queryRole = (query.get("role") || "user").toLowerCase();

  let role = "USER";
  if (queryRole === "admin") role = "ADMIN";
  if (queryRole === "superadmin") role = "SUPER_ADMIN";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      const { token, role: returnedRole, status } = res.data;

      // ✅ APPROVAL CHECK
      if (status !== "APPROVED") {
        toast.error("Account not approved");
        return;
      }

      // ✅ STORE DATA
      localStorage.setItem("token", token);
      localStorage.setItem("role", returnedRole);
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name: email.split("@")[0],
        })
      );

      toast.success("Login Successful!");

      // ✅ ROLE BASED REDIRECT
      if (returnedRole === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      } else if (returnedRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }

    } catch (error: any) {
      console.error(error);

      // ✅ STRONG ERROR HANDLING
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Invalid credentials";

      toast.error(message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://smartbackend-production-f6cd.up.railway.app/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <motion.div
        className="flex w-[900px] h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* LEFT */}
        <div className="w-1/2 bg-gradient-to-b from-blue-400 to-blue-600 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to SCM</h2>
          <p className="text-sm">
            Smart Complaint Management System with AI sentiment analysis.
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            {role === "SUPER_ADMIN"
              ? "Super Admin Login"
              : role === "ADMIN"
              ? "Admin Login"
              : "Student Login"}
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") loginUser();
            }}
          />

          <p
            className="text-sm text-blue-600 cursor-pointer mb-4"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <button
            onClick={loginUser}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            LOGIN
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full mt-4 border p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google"
              className="w-5"
            />
            Sign in with Google
          </button>

          <p className="text-sm mt-4 text-center">
            New User?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer"
            >
              Signup
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;