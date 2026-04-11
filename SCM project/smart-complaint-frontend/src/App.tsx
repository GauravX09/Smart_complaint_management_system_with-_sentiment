import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

/* ================= PUBLIC ================= */
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ================= USER ================= */
import UserLayout from "./layouts/UserLayout";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import Help from "./pages/user/Help";
import Notifications from "./pages/user/Notification";
import Profile from "./pages/user/Profile";
import ShareComplaint from "./pages/ShareComplaint";


/* === MY COMPLAINTS === */
import TotalComplaints from "./pages/my-complaints/TotalComplaints";
import PendingComplaints from "./pages/my-complaints/PendingComplaints";
import ResolvedComplaints from "./pages/my-complaints/ResolvedComplaints";
import RejectedComplaints from "./pages/my-complaints/RejectedComplaints";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";

import AdminUserList from "./pages/admin/AdminUserList";

/* ================= SUPER ADMIN ================= */
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import AdminList from "./pages/super-admin/AdminList";
import UserList from "./pages/super-admin/UserList";
import AuthorizedSignatory from "./pages/super-admin/AuthorizedSignatory";
import NotificationsSA from "./pages/user/Notification";
import HelpSA from "./pages/user/Help";
import AlertSentiment from "./pages/super-admin/AlertSentiment";
import AuditLogs from "./pages/super-admin/AuditLog";

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= USER ================= */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="USER">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="submit-complaint" element={<SubmitComplaint />} />

          {/* ✅ FIXED MISSING ROUTES */}
          <Route path="help" element={<Help />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="share-complaint" element={<ShareComplaint />} />

          {/* MY COMPLAINTS */}
          <Route path="my-complaints">
            <Route index element={<Navigate to="total" replace />} />
            <Route path="total" element={<TotalComplaints />} />
            <Route path="pending" element={<PendingComplaints />} />
            <Route path="resolved" element={<ResolvedComplaints />} />
            <Route path="rejected" element={<RejectedComplaints />} />
          </Route>
        </Route>


        
                 /* ================= ADMIN ================= */
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* DEFAULT REDIRECT */}
          <Route index element={<Navigate to="dashboard" replace />} />
        
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
        
          {/* ✅ FIXED HERE */}
          <Route path="users" element={<AdminUserList />} />
        </Route>

        {/* ================= SUPER ADMIN ================= */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="admin-list" element={<AdminList />} />
          <Route path="users" element={<UserList />} />
          <Route path="authorized-signatory" element={<AuthorizedSignatory />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="notifications" element={<NotificationsSA />} />
          <Route path="alerts" element={<AlertSentiment />} />
          <Route path="help" element={<HelpSA />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;