import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const queryRole = (query.get("role") || "student").toLowerCase();

  /**
   * 🔒 HARD BLOCK: SUPER ADMIN IS NOT ALLOWED HERE
   */
  useEffect(() => {
    if (queryRole === "superadmin") {
      navigate("/super-admin/login", { replace: true });
    }
  }, [queryRole, navigate]);

  // Only ADMIN or USER allowed here
  const role = queryRole === "admin" ? "ADMIN" : "USER";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------
  // LOGIN FUNCTION (FIXED)
  // ---------------------------
  const loginUser = () => {
    if (!form.email || !form.password) {
      toast.error("Email and Password are required");
      return;
    }

    API.post("/api/auth/login", {
      email: form.email,
      password: form.password,
      role,
    })
      .then((res) => {
        const data = res.data || {};
        const token = data.token;
        const returnedRole = data.role ?? role;

        const userObj =
          data.user ?? {
            id: data.id,
            name: data.name,
            email: data.email ?? form.email,
            role: returnedRole,
          };

        if (token) localStorage.setItem("token", token);
        if (returnedRole) localStorage.setItem("role", returnedRole);
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (userObj?.email)
          localStorage.setItem("email", userObj.email);

        toast.success("Login Successful!");

        // ✅ FIXED REDIRECTS
        if (returnedRole === "ADMIN") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      })
      .catch(() => toast.error("Invalid Credentials"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex"
      >
        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-blue-100">
          <img src="/admin-login.png" alt="Login" className="w-4/5" />
        </div>

        {/* RIGHT FORM */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-10 bg-blue-600 text-white"
        >
          <h2 className="text-3xl font-bold mb-6">
            {role === "ADMIN" ? "Admin Login" : "Student Login"}
          </h2>

          <input
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg mb-4 text-black"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg mb-6 text-black"
            value={form.password}
            onChange={handleChange}
          />

          <button
            onClick={loginUser}
            className="w-full bg-white text-blue-600 font-semibold p-3 rounded-lg hover:bg-gray-200 transition"
          >
            SIGN IN
          </button>

          {/* ADMIN OPTIONS */}
          {role === "ADMIN" && (
            <div className="mt-4 space-y-2 text-sm">
              <p
                className="underline cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </p>

              <button
                onClick={() => navigate("/create-admin")}
                className="w-full border border-white py-2 rounded-lg hover:bg-white hover:text-blue-600 transition"
              >
                Create New Admin
              </button>
            </div>
          )}

          {/* USER REGISTRATION REDIRECT */}
          {role === "USER" && (
            <p className="mt-4 text-sm">
              Don’t have an account?
              <span
                onClick={() => navigate("/register")}
                className="ml-2 underline cursor-pointer font-bold"
              >
                Create one
              </span>
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
