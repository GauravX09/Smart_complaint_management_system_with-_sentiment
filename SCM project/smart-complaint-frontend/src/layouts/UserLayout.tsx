import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import UserSidebar from "../components/sidebar/UserSidebar";
import UserNavbar from "../components/navbar/UserNavbar";

const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <UserSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <UserNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default UserLayout;
