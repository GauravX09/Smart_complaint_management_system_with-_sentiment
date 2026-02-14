import React from "react";
import { Link, useLocation } from "react-router-dom";

type Role = "USER" | "SUPER_ADMIN";

type MenuItem = {
  label: string;
  path: string;
  icon: string;
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

  const widthClass = collapsed ? "w-18" : "w-64";
  const pxWidth = collapsed ? 72 : 256;

  /* ================= USER MENU ================= */
  const userMenu: MenuItem[] = [
    { label: "Dashboard", path: "/user/dashboard", icon: "🏠" },
    { label: "Submit Complaint", path: "/user/submit-complaint", icon: "✏️" },
    { label: "My Complaints", path: "/user/my-complaints/total", icon: "📄" },
  ];

  /* ================= SUPER ADMIN MENU ================= */
  const superAdminMenu: MenuItem[] = [
    { label: "Dashboard", path: "/super-admin/dashboard", icon: "📊" },
    { label: "Admin List", path: "/super-admin/admin-list", icon: "👮" },
    { label: "User List", path: "/super-admin/users", icon: "👥" },
    {
      label: "Authorized Signatory",
      path: "/super-admin/authorized-signatory",
      icon: "✍️",
    },
    {
      label: "Audit Logs",
      path: "/super-admin/audit-logs",
      icon: "📝",
    },
    {
      label: "Notifications",
      path: "/super-admin/notifications",
      icon: "🔔",
      badge: 2,
    },
    {
      label: "Alert & Sentiment",
      path: "/super-admin/alerts",
      icon: "🚨",
    },
    {
      label: "Help & Support",
      path: "/super-admin/help",
      icon: "❓",
    },
  ];

  const menu = role === "SUPER_ADMIN" ? superAdminMenu : userMenu;

  return (
    <aside
      className={`h-full ${widthClass} bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-xl`}
      style={{ width: pxWidth, transition: "width 220ms ease" }}
    >
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          {!collapsed && (
            <h1 className="text-lg font-bold">
              {role === "SUPER_ADMIN"
                ? "SCM Super Admin"
                : "Smart Complaint"}
            </h1>
          )}
        </div>

        {setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded bg-white/10 hover:bg-white/20"
          >
            ☰
          </button>
        )}
      </div>

      {/* MENU */}
      <nav className="mt-4">
        <ul className="space-y-2 px-3">
          {menu.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between gap-3 p-2 rounded transition
                    ${
                      isActive
                        ? "bg-white text-indigo-700 font-semibold"
                        : "hover:bg-white/20"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
