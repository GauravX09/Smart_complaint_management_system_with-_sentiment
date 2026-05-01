import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const role = (localStorage.getItem("role") as Role) || "USER";

  const expandedWidth = 260;
  const collapsedWidth = 90;
  const sidebarWidth = collapsed ? collapsedWidth : expandedWidth;

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">

      {/* 🔥 NAVBAR */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          zIndex: 50,
        }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <Navbar />
      </div>

      {/* 🔥 MAIN */}
      <div className="flex pt-[64px] h-full">

        {/* 🔥 SIDEBAR */}
        <div
          style={{
            position: "fixed",
            top: 64,
            bottom: 0,
            width: sidebarWidth,
            transition: "all 0.25s ease",
            zIndex: 40,
          }}
          className="bg-white border-r border-gray-200 shadow-sm"
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            role={role}
          />
        </div>

        {/* 🔥 CONTENT */}
        <main
          style={{
            marginLeft: sidebarWidth,
            transition: "all 0.25s ease",
          }}
          className="flex-1 h-full overflow-y-auto"
        >
          {/* CONTENT CONTAINER */}
          <div className="p-6 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default Layout;