import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // -----------------------------------
  // ✅ AUTO REDIRECT (ALL ROLES)
  // -----------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "USER") {
        navigate("/user/dashboard", { replace: true });
      }
    }
  }, [navigate]);
  // -----------------------------------

  const loginUser = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", {
        email,
        password,
      });

      /**
       * Expected backend response:
       * {
       *   token,
       *   role,
       *   status
       * }
       */

      const { token, role, status } = res.data;

      // ⛔ STATUS CHECK
      if (status === "PENDING") {
        setError("Your account is pending approval.");
        return;
      }

      if (status === "REJECTED") {
        setError("Your registration was rejected.");
        return;
      }

      if (status === "BLOCKED") {
        setError("Your account has been blocked. Contact support.");
        return;
      }

      // ✅ STORE SESSION
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);

      // ✅ ROLE BASED REDIRECT
      if (role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard", { replace: true });
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center bg-gray-200">
      <div className="flex bg-white shadow-2xl rounded-xl overflow-hidden w-[900px] h-[420px]">
        
        {/* LEFT IMAGE */}
        <div className="w-1/2 bg-blue-50 flex justify-center items-center">
          <img
            src="/image.png"
            alt="Login"
            className="w-2/3"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-1/2 p-10 space-y-4">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            System Login
          </h2>

          {error && (
            <div className="text-red-700 bg-red-100 p-2 rounded text-sm">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={loginUser}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          <p
            className="text-sm text-center text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Create one
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
