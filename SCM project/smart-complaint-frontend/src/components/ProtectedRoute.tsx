import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  role?: string;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const rawRole = localStorage.getItem("role");

  // 🚫 Not logged in
  if (!token || !rawRole) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // 🚫 Role mismatch
  if (role && rawRole.toUpperCase() !== role.toUpperCase()) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // ✅ Access allowed
  return <>{children}</>;
};

export default ProtectedRoute;