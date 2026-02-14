import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  role?: string; // "USER" or "ADMIN"
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ role, children }) => {
  const rawUser = localStorage.getItem("user");
  const rawRole = localStorage.getItem("role"); // stored during login

  // No user logged in
  if (!rawUser || !rawRole) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  let userObj;
  try {
    userObj = JSON.parse(rawUser);
  } catch {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // User role doesn't match required role
  if (role && rawRole.toUpperCase() !== role.toUpperCase()) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // All good → render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
