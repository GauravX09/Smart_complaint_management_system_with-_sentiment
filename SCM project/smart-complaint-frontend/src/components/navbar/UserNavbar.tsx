import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, UserCircle, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

interface UserNavbarProps {
  toggleSidebar: () => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const name =
    JSON.parse(localStorage.getItem("user") || "{}")?.name || "User";
  const email = localStorage.getItem("email") || "";

  /* ------------------ THEME ------------------ */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle(
        "dark",
        savedTheme === "dark"
      );
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  /* -------------- CLOSE ON OUTSIDE CLICK -------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ------------------ LOGOUT ------------------ */
  const logout = () => {
    localStorage.clear();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b dark:border-gray-700 flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300"
        >
          <Menu size={22} />
        </button>

        <span className="font-semibold text-gray-800 dark:text-white">
          Smart Complaint Management
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Dark Mode */}
        <ThemeToggle theme={theme} toggle={toggleTheme} />

        {/* Profile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <UserCircle size={28} />
          <span className="hidden md:block font-medium">{name}</span>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-14 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b dark:border-gray-700">
                <p className="font-semibold text-gray-800 dark:text-white">
                  {name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {email}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/user/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default UserNavbar;
