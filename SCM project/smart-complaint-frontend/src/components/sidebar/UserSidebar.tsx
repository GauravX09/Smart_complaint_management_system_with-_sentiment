import React, { useState, useEffect } from "react";
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

  // 🔥 AUTO OPEN MENU BASED ON ROUTE
  useEffect(() => {
    if (location.pathname.includes("my-complaints")) {
      setOpenMenu("complaints");
    } else if (location.pathname.includes("submit-complaint")) {
      setOpenMenu("new");
    }
  }, [location.pathname]);

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  const baseLink =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative";

  const activeLink =
    "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow";

  const inactiveLink =
    "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800";

  // 🔥 FAKE NOTIFICATION COUNT (replace with API later)
  const notificationCount = 3;

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
        <SidebarItem
          to="/user/dashboard"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          isOpen={isOpen}
          active={isActive("/user/dashboard")}
        />

        {/* My Complaints */}
        <Dropdown
          label="My Complaints"
          icon={<FileText size={18} />}
          isOpen={isOpen}
          active={isActive("/user/my-complaints")}
          open={openMenu === "complaints"}
          toggle={() =>
            setOpenMenu(openMenu === "complaints" ? null : "complaints")
          }
        >
          {["total", "pending", "resolved", "rejected"].map((status) => (
            <NavLink
              key={status}
              to={`/user/my-complaints/${status}`}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-500 hover:text-indigo-600"
                }`
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </NavLink>
          ))}
        </Dropdown>

        {/* New Complaint */}
        <Dropdown
          label="New Complaint"
          icon={<PlusCircle size={18} />}
          isOpen={isOpen}
          active={isActive("/user/submit-complaint")}
          open={openMenu === "new"}
          toggle={() =>
            setOpenMenu(openMenu === "new" ? null : "new")
          }
        >
          <NavLink
            to="/user/submit-complaint"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-indigo-600"
          >
            <PlusCircle size={14} />
            Submit Complaint
          </NavLink>

          <NavLink
            to="/user/share-complaint"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-indigo-600"
          >
            <Share2 size={14} />
            Share Link
          </NavLink>
        </Dropdown>

        {/* Help */}
        <SidebarItem
          to="/user/help"
          icon={<HelpCircle size={18} />}
          label="Help"
          isOpen={isOpen}
          active={isActive("/user/help")}
        />

        {/* Notifications */}
        <SidebarItem
          to="/user/notifications"
          icon={<Bell size={18} />}
          label="Notifications"
          isOpen={isOpen}
          active={isActive("/user/notifications")}
          badge={notificationCount}
        />

        {/* Profile */}
        <SidebarItem
          to="/user/profile"
          icon={<User size={18} />}
          label="Profile"
          isOpen={isOpen}
          active={isActive("/user/profile")}
        />
      </nav>
    </aside>
  );
};

/* 🔥 Sidebar Item */
const SidebarItem = ({
  to,
  icon,
  label,
  isOpen,
  active,
  badge,
}: any) => (
  <NavLink
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium relative ${
      active
        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
        : "text-gray-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-800"
    }`}
    title={!isOpen ? label : ""}
  >
    {icon}
    {isOpen && <span>{label}</span>}

    {badge && (
      <span className="absolute right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </NavLink>
);

/* 🔥 Dropdown */
const Dropdown = ({
  label,
  icon,
  isOpen,
  active,
  open,
  toggle,
  children,
}: any) => (
  <>
    <button
      onClick={toggle}
      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
          : "text-gray-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
      title={!isOpen ? label : ""}
    >
      <div className="flex items-center gap-3">
        {icon}
        {isOpen && <span>{label}</span>}
      </div>

      {isOpen && (
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.span>
      )}
    </button>

    <AnimatePresence>
      {open && isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="ml-10 space-y-1"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </>
);

export default UserSidebar;