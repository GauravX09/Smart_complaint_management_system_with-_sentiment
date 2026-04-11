import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= LOGIN FUNCTION =================
  const loginUser = async () => {
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      // ✅ FINAL CORRECT API PATH
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      const { token, role, status } = res.data;

      // ✅ STATUS CHECK
      if (status !== "APPROVED") {
        toast.error("Account not approved");
        return;
      }

      // ✅ STORE DATA
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "user",
        JSON.stringify({ email, name: email.split("@")[0] })
      );

      toast.success("Login Successful!");

      // ✅ ROLE BASED REDIRECT
      if (role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }

    } catch (error: any) {
      console.error(error);

      // ✅ Proper backend error handling
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Login failed");
      }
    }
  };

  // ================= GOOGLE LOGIN =================
  const handleGoogleLogin = () => {
    window.location.href =
      "https://smartbackend-production-5756.up.railway.app/oauth2/authorization/google";
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex w-[900px] h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* LEFT */}
        <div className="w-1/2 bg-gradient-to-b from-blue-400 to-blue-600 text-white p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to SCM</h2>
          <p className="text-sm opacity-90">
            Smart Complaint Management System  
            Submit, track and resolve complaints easily.
          </p>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 p-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Login
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
              alt="Google login"
              className="w-5"
            />
            Sign in with Google
          </button>

          <p className="text-sm mt-4 text-center">
            New User?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Signup
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;