import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import UserSidebar from "../components/sidebar/UserSidebar";
import UserNavbar from "../components/navbar/UserNavbar";

const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 w-full">
        
        {/* NAVBAR */}
        <UserNavbar toggleSidebar={toggleSidebar} />

        {/* CONTENT */}
        <motion.main
          key="page"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default UserLayout;