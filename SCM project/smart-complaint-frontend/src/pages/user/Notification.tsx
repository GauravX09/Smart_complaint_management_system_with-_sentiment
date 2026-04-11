import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserCheck,
  FaUserClock,
  FaExclamationTriangle,
  FaBell,
} from "react-icons/fa";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: "APPROVAL" | "PENDING" | "ALERT";
  read: boolean;
  time: string;
};

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Complaint Submitted",
      message: "Your complaint has been successfully registered.",
      type: "PENDING",
      read: false,
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Complaint Resolved",
      message: "Your complaint has been resolved successfully.",
      type: "APPROVAL",
      read: true,
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "System Alert",
      message: "Suspicious activity detected in your account.",
      type: "ALERT",
      read: false,
      time: "Yesterday",
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "APPROVAL":
        return <FaUserCheck className="text-green-600" />;
      case "PENDING":
        return <FaUserClock className="text-yellow-500" />;
      case "ALERT":
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBell />;
    }
  };

  const filtered =
    filter === "ALL"
      ? notifications
      : notifications.filter((n) => !n.read);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-500">
            Stay updated with your complaint activity
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-sm text-indigo-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg text-sm ${
            filter === "ALL"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-4 py-2 rounded-lg text-sm ${
            filter === "UNREAD"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Unread
        </button>
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow text-center">
          <FaBell className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500">No notifications</p>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {filtered.map((n) => (
          <motion.div
            key={n.id}
            whileHover={{ scale: 1.01 }}
            className={`flex items-start gap-4 p-5 rounded-xl shadow bg-white dark:bg-gray-800 border-l-4 ${
              n.read
                ? "border-gray-300"
                : "border-indigo-500"
            }`}
          >
            <div className="text-2xl mt-1">
              {getIcon(n.type)}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3
                  className={`font-semibold ${
                    n.read
                      ? "text-gray-500"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {n.title}
                </h3>
                <span className="text-xs text-gray-400">
                  {n.time}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {n.message}
              </p>

              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="mt-2 text-xs text-indigo-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notifications;