// src/components/Layout.tsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // 🔥 GET ROLE FROM LOCALSTORAGE (VERY IMPORTANT)
  const role = (localStorage.getItem("role") as Role) || "USER";

  // Sidebar widths
  const expandedWidth = 256;
  const collapsedWidth = 80;
  const sidebarWidth = collapsed ? collapsedWidth : expandedWidth;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ===== FIXED NAVBAR ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          zIndex: 50,
        }}
      >
        <Navbar />
      </div>

      {/* ===== MAIN WRAPPER ===== */}
      <div className="flex pt-[64px]">
        {/* ===== SIDEBAR ===== */}
        <div
          style={{
            position: "fixed",
            top: 64,
            bottom: 0,
            width: sidebarWidth,
            transition: "width 0.25s ease",
            zIndex: 40,
          }}
        >
          {/* 🔥 PASS ROLE HERE */}
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            role={role}
          />
        </div>

        {/* ===== PAGE CONTENT ===== */}
        <main
          style={{
            marginLeft: sidebarWidth,
            transition: "margin-left 0.25s ease",
          }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;