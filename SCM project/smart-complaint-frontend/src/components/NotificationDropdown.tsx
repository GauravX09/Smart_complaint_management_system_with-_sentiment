import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

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

  // ================= FETCH =================
  const fetchNotifications = async () => {
    try {
      const res = await API.get(
        `/api/notifications?userEmail=${user.email}`
      );
      setNotifications(res.data);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    fetchNotifications();

    // 🔥 AUTO REFRESH (every 10 sec)
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [user.email]);

  // ================= MARK AS READ =================
  const markAsRead = async (id: number) => {
    try {
      await API.put(`/api/notifications/${id}/read`);

      // update UI instantly
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900
      rounded-xl shadow-lg border dark:border-gray-700 z-50"
    >
      <div className="p-3 border-b font-semibold text-indigo-600 flex justify-between">
        Notifications
        <span className="text-xs text-gray-400">
          {notifications.filter((n) => !n.isRead).length} new
        </span>
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
            onClick={() => markAsRead(n.id)}
            className={`p-3 text-sm border-b cursor-pointer transition
              ${
                n.isRead
                  ? "bg-gray-50 dark:bg-gray-800"
                  : "bg-indigo-50 hover:bg-indigo-100"
              }
            `}
          >
            <div className="font-semibold">{n.title}</div>

            <div className="text-xs text-gray-600 dark:text-gray-400">
              {n.message}
            </div>

            <div className="text-[10px] text-gray-400 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;