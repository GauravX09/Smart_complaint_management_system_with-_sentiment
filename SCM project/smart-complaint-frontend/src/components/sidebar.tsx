import React from "react";
import { Link, useLocation } from "react-router-dom";

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

type MenuItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
};

type Props = {
  role?: Role;
  collapsed?: boolean;
  setCollapsed?: (v: boolean) => void;
};

const Sidebar: React.FC<Props> = ({
  role = "USER",
  collapsed = false,
  setCollapsed,
}) => {
  const location = useLocation();

  const width = collapsed ? 80 : 260;

  /* 🔥 ICONS (clean, not emoji) */
  const Icon = (name: string) => {
    const icons: any = {
      dashboard: "📊",
      complaints: "📋",
      users: "👥",
      admin: "👮",
      logs: "📝",
      alert: "🚨",
      help: "❓",
    };
    return <span className="text-lg">{icons[name]}</span>;
  };

  /* ================= MENUS ================= */

  const userMenu: MenuItem[] = [
    { label: "Dashboard", path: "/user/dashboard", icon: Icon("dashboard") },
    { label: "Submit", path: "/user/submit-complaint", icon: Icon("complaints") },
    { label: "My Complaints", path: "/user/my-complaints/total", icon: Icon("complaints") },
  ];

  const adminMenu: MenuItem[] = [
    { label: "Dashboard", path: "/admin/dashboard", icon: Icon("dashboard") },
    { label: "Complaints", path: "/admin/complaints", icon: Icon("complaints") },
    { label: "Users", path: "/admin/users", icon: Icon("users") },
  ];

  const superAdminMenu: MenuItem[] = [
    { label: "Dashboard", path: "/super-admin/dashboard", icon: Icon("dashboard") },
    { label: "Admins", path: "/super-admin/admin-list", icon: Icon("admin") },
    { label: "Users", path: "/super-admin/users", icon: Icon("users") },
    { label: "Audit Logs", path: "/super-admin/audit-logs", icon: Icon("logs") },
    { label: "Alerts", path: "/super-admin/alerts", icon: Icon("alert") },
    { label: "Help", path: "/super-admin/help", icon: Icon("help") },
  ];

  const menu =
    role === "ADMIN"
      ? adminMenu
      : role === "SUPER_ADMIN"
      ? superAdminMenu
      : userMenu;

  return (
    <aside
      className="h-full bg-white border-r border-gray-200 flex flex-col"
      style={{ width, transition: "all 0.25s ease" }}
    >

      {/* 🔥 HEADER */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!collapsed && (
          <h1 className="text-md font-bold text-indigo-600">
            Smart System
          </h1>
        )}

        {setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-indigo-600"
          >
            ☰
          </button>
        )}
      </div>

      {/* 🔥 MENU */}
      <div className="flex-1 px-2 py-4 space-y-1">

        {menu.map((item) => {
          const active =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition
              ${
                active
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

      </div>

      {/* 🔥 FOOTER */}
      {!collapsed && (
        <div className="p-4 border-t text-xs text-gray-400">
          Admin Panel v1.0
        </div>
      )}
    </aside>
  );
};

export default Sidebar;