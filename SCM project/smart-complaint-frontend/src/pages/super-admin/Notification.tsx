import React, { useState } from "react";
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
  // 🔹 TEMP MOCK DATA (replace with API later)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Registration Pending",
      message: "Seeta Kumari has registered as USER (BUSINESS)",
      type: "PENDING",
      read: false,
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "Admin Approved",
      message: "Neha Sharma (LAW) has been approved as ADMIN",
      type: "APPROVAL",
      read: true,
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "System Alert",
      message: "Multiple failed login attempts detected",
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications
        </h1>
        <p className="text-gray-500">
          System alerts and user activity updates
        </p>
      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 && (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <FaBell className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500">No notifications</p>
        </div>
      )}

      {/* NOTIFICATION LIST */}
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-4 p-5 rounded-xl shadow-sm bg-white border-l-4 ${
              n.read
                ? "border-gray-300"
                : "border-indigo-500"
            }`}
          >
            {/* ICON */}
            <div className="text-2xl mt-1">
              {getIcon(n.type)}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3
                  className={`font-semibold ${
                    n.read
                      ? "text-gray-600"
                      : "text-gray-800"
                  }`}
                >
                  {n.title}
                </h3>
                <span className="text-xs text-gray-400">
                  {n.time}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
