// src/components/Layout.tsx
import React, { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Sidebar widths
  const expandedWidth = 256;      // w-64
  const collapsedWidth = 80;      // w-20 (better spacing)
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
        {/* ----- FIXED SIDEBAR ----- */}
        <div
          style={{
            position: "fixed",
            top: 64, // below navbar
            bottom: 0,
            width: sidebarWidth,
            transition: "width 0.25s ease",
            zIndex: 40,
          }}
        >
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* ----- PAGE CONTENT ----- */}
        <main
          style={{
            marginLeft: sidebarWidth,
            transition: "margin-left 0.25s ease",
          }}
          className="flex-1 p-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
