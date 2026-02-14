import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Bell,
  UserCog,
  AlertTriangle,
  HelpCircle,
  FileSearch, // ✅ Audit Logs icon
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const SuperAdminLayout: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /* ---------------- THEME SYNC ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle(
        "dark",
        saved === "dark"
      );
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle(
      "dark",
      next === "dark"
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-xl">
        {/* Logo */}
        <div className="px-6 py-5 text-xl font-bold tracking-wide border-b border-white/20">
          ⚡ SCM Super Admin
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-6 px-3">
          {/* ===== MAIN ===== */}
          <div>
            <p className="px-3 mb-2 text-xs uppercase tracking-wider text-white/60">
              Main
            </p>

            <SidebarItem
              to="/super-admin/dashboard"
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
            />
          </div>

          {/* ===== MANAGEMENT ===== */}
          <div>
            <p className="px-3 mb-2 text-xs uppercase tracking-wider text-white/60">
              Management
            </p>

            <SidebarItem
              to="/super-admin/admin-list"
              icon={<UserCog size={18} />}
              label="Admin List"
            />

            <SidebarItem
              to="/super-admin/users"
              icon={<Users size={18} />}
              label="User List"
            />

            <SidebarItem
              to="/super-admin/authorized-signatory"
              icon={<ShieldCheck size={18} />}
              label="Authorized Signatory"
            />

            {/* ✅ AUDIT LOGS */}
            <SidebarItem
              to="/super-admin/audit-logs"
              icon={<FileSearch size={18} />}
              label="Audit Logs"
            />
          </div>

          {/* ===== SYSTEM ===== */}
          <div>
            <p className="px-3 mb-2 text-xs uppercase tracking-wider text-white/60">
              System
            </p>

            <SidebarItem
              to="/super-admin/notifications"
              icon={<Bell size={18} />}
              label="Notifications"
              badge={2}
            />

            <SidebarItem
              to="/super-admin/alerts"
              icon={<AlertTriangle size={18} />}
              label="Alert & Sentiment"
            />

            <SidebarItem
              to="/super-admin/help"
              icon={<HelpCircle size={18} />}
              label="Help & Support"
            />
          </div>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shadow-sm">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Super Admin Dashboard
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggle={toggleTheme} />

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Super Admin
              </span>
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 flex-1 bg-gray-100 dark:bg-gray-900 transition-colors">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;

/* ================= SIDEBAR ITEM ================= */

type SidebarItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  badge,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
         ${
           isActive
             ? "bg-white text-indigo-700 shadow font-semibold border-l-4 border-indigo-700"
             : "text-white/90 hover:bg-white/20"
         }`
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>

      {badge !== undefined && badge > 0 && (
        <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
};
