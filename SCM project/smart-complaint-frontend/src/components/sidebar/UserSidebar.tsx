import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  HelpCircle,
  Bell,
  User,
  ChevronLeft,
  ChevronDown,
  Share2,
} from "lucide-react";

interface UserSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  const baseLink =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all";

  const activeLink =
    "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow";

  const inactiveLink =
    "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800";

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white dark:bg-gray-900 h-full border-r dark:border-gray-700 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
        {isOpen && (
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            SCM
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-300"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <NavLink
          to="/user/dashboard"
          className={`${baseLink} ${
            isActive("/user/dashboard") ? activeLink : inactiveLink
          }`}
        >
          <LayoutDashboard size={18} />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        {/* My Complaints */}
        <button
          onClick={() =>
            setOpenMenu(openMenu === "complaints" ? null : "complaints")
          }
          className={`${baseLink} ${
            isActive("/user/my-complaints")
              ? activeLink
              : inactiveLink
          } w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <FileText size={18} />
            {isOpen && <span>My Complaints</span>}
          </div>
          {isOpen && (
            <motion.span
              animate={{ rotate: openMenu === "complaints" ? 180 : 0 }}
            >
              <ChevronDown size={16} />
            </motion.span>
          )}
        </button>

        <AnimatePresence>
          {openMenu === "complaints" && isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-10 space-y-1"
            >
              {["total", "pending", "resolved", "rejected"].map(
                (status) => (
                  <NavLink
                    key={status}
                    to={`/user/my-complaints/${status}`}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm transition ${
                        isActive
                          ? "text-indigo-600 font-semibold"
                          : "text-gray-500 hover:text-indigo-600"
                      }`
                    }
                  >
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </NavLink>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Complaint */}
        <button
          onClick={() =>
            setOpenMenu(openMenu === "new" ? null : "new")
          }
          className={`${baseLink} ${
            isActive("/user/submit-complaint")
              ? activeLink
              : inactiveLink
          } w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <PlusCircle size={18} />
            {isOpen && <span>New Complaint</span>}
          </div>
          {isOpen && (
            <motion.span
              animate={{ rotate: openMenu === "new" ? 180 : 0 }}
            >
              <ChevronDown size={16} />
            </motion.span>
          )}
        </button>

        <AnimatePresence>
          {openMenu === "new" && isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-10 space-y-1"
            >
              <NavLink
                to="/user/submit-complaint"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-500 hover:text-indigo-600"
              >
                <PlusCircle size={14} />
                Submit Complaint
              </NavLink>

              <NavLink
                to="/user/share-complaint"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-gray-500 hover:text-indigo-600"
              >
                <Share2 size={14} />
                Share Complaint Link
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Other Links */}
        <NavLink
          to="/user/help"
          className={`${baseLink} ${
            isActive("/user/help") ? activeLink : inactiveLink
          }`}
        >
          <HelpCircle size={18} />
          {isOpen && <span>Help</span>}
        </NavLink>

        <NavLink
          to="/user/notifications"
          className={`${baseLink} ${
            isActive("/user/notifications")
              ? activeLink
              : inactiveLink
          }`}
        >
          <Bell size={18} />
          {isOpen && <span>Notifications</span>}
        </NavLink>

        <NavLink
          to="/user/profile"
          className={`${baseLink} ${
            isActive("/user/profile") ? activeLink : inactiveLink
          }`}
        >
          <User size={18} />
          {isOpen && <span>Profile</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default UserSidebar;
