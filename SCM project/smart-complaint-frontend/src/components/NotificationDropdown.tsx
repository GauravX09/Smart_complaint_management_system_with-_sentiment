import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`/api/notifications?userId=${user.id}`)
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900
        rounded-xl shadow-lg border dark:border-gray-700 z-50
      "
    >
      <div className="p-3 border-b font-semibold text-indigo-600">
        Notifications
      </div>

      <div className="max-h-64 overflow-y-auto">
        {loading && (
          <div className="p-4 text-sm text-gray-500">Loading...</div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="p-4 text-sm text-gray-500">
            No notifications
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 text-sm border-b cursor-pointer
              ${n.isRead ? "bg-gray-50 dark:bg-gray-800" : "bg-indigo-50"}
            `}
          >
            <div className="font-semibold">{n.title}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {n.message}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              {n.createdAt}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;
