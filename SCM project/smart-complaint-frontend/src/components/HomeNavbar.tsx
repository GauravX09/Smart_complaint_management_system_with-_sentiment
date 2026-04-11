import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import useDarkMode from "../hooks/useDarkMode";
import HelpModal from "./HelpModal";
import NotificationDropdown from "./NotificationDropdown";

const HomeNavbar: React.FC = () => {
  const [solid, setSolid] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useDarkMode();

  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
            SC
          </div>
          <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            Smart Complaint
          </div>
        </Link>

        {/* Right Menu */}
        <div className="flex items-center gap-4">

          {/* Home */}
          <Link
            to="/"
            className={`hidden md:inline-block px-3 py-1 rounded ${
              location.pathname === "/"
                ? "font-semibold text-indigo-700"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            Home
          </Link>

          {/* Help */}
          <button
            title="Help"
            className="text-xl text-gray-700 dark:text-gray-300 hover:text-indigo-600"
            onClick={() => setShowHelp(true)}
          >
            ❓
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              title="Notifications"
              className="text-xl text-gray-700 dark:text-gray-300 hover:text-indigo-600"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
            </button>

            {showNotifications && <NotificationDropdown />}
          </div>

          {/* 🔥 ROLE BASED UI */}
          {isLoggedIn ? (
            <>
              {/* Dashboard */}
              <button
                onClick={() => {
                  if (role === "SUPER_ADMIN") {
                    navigate("/super-admin/dashboard");
                  } else if (role === "ADMIN") {
                    navigate("/admin/dashboard");
                  } else {
                    navigate("/user/dashboard");
                  }
                }}
                className="px-4 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Dashboard
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="px-4 py-1 rounded text-gray-700 dark:text-gray-300 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="px-4 py-1 rounded bg-yellow-400 text-black hover:bg-yellow-300 font-medium"
              >
                Register
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} toggle={toggle} />
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </motion.nav>
  );
};

export default HomeNavbar;