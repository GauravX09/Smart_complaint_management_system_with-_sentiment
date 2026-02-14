import React, { useState } from "react";
import { FaEnvelope, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";

type Props = {
  darkMode: boolean;
  toggleTheme: () => void;
};

const SuperAdminNavbar: React.FC<Props> = ({ darkMode, toggleTheme }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/super-admin/login";
  };

  return (
    <header className="w-full h-16 bg-gray-900 text-white flex items-center justify-between px-6 shadow">
      {/* LEFT: LOGO */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-indigo-400">SCM</span>
        <span className="text-sm opacity-70">Super Admin</span>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-5 relative">
        {/* Mail */}
        <FaEnvelope className="cursor-pointer text-lg hover:text-indigo-400" />

        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme} className="text-lg">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Profile */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
            {user.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <span className="hidden md:block font-medium">
            {user.name || "Super Admin"}
          </span>

          <FaChevronDown className="text-sm opacity-70" />
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-14 w-40 bg-white text-gray-800 rounded shadow-md overflow-hidden">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => (window.location.href = "/super-admin/profile")}
            >
              Profile
            </button>

            <button
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default SuperAdminNavbar;
