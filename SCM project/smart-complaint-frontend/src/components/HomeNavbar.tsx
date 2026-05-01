import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeNavbar: React.FC = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const goDashboard = () => {
    if (role === "SUPER_ADMIN") navigate("/super-admin/dashboard");
    else if (role === "ADMIN") navigate("/admin/dashboard");
    else navigate("/user/dashboard");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div className="font-semibold text-lg leading-tight">
            Smart Complaint
            <div className="text-xs text-indigo-200">
              Management System
            </div>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {isLoggedIn ? (
            <>
              <button
                onClick={goDashboard}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                Login
              </Link>

              {/* Signup */}
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;