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

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ================= USER PAGES ================= */
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";

/* === MY COMPLAINTS === */
import TotalComplaints from "./pages/my-complaints/TotalComplaints";
import PendingComplaints from "./pages/my-complaints/PendingComplaints";
import ResolvedComplaints from "./pages/my-complaints/ResolvedComplaints";
import RejectedComplaints from "./pages/my-complaints/RejectedComplaints";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/admin/AdminComplaints";
import UsersList from "./pages/UsersList";

/* ================= SUPER ADMIN ================= */
import SuperAdminLogin from "./pages/super-admin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import SuperAdminForgotPassword from "./pages/SuperAdminForgotPassword";
import SuperAdminResetPassword from "./pages/SuperAdminResetPassword";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

import AdminList from "./pages/super-admin/AdminList";
import UserList from "./pages/super-admin/UserList";
import AuthorizedSignatory from "./pages/super-admin/AuthorizedSignatory";
import Notifications from "./pages/super-admin/Notification";
import Help from "./pages/super-admin/Help";
import AlertSentiment from "./pages/super-admin/AlertSentiment";
import AuditLogs from "./pages/super-admin/AuditLog";

/* ================= USER LAYOUT ================= */
import UserLayout from "./layouts/UserLayout";

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* SUPER ADMIN (PUBLIC) */}
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route
          path="/super-admin/forgot-password"
          element={<SuperAdminForgotPassword />}
        />
        <Route
          path="/super-admin/reset-password"
          element={<SuperAdminResetPassword />}
        />

        {/* SUPER ADMIN (PROTECTED) */}
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="admin-list" element={<AdminList />} />
          <Route path="users" element={<UserList />} />
          <Route path="authorized-signatory" element={<AuthorizedSignatory />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="alerts" element={<AlertSentiment />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* USER */}
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
          <Route path="my-complaints">
            <Route index element={<Navigate to="total" replace />} />
            <Route path="total" element={<TotalComplaints />} />
            <Route path="pending" element={<PendingComplaints />} />
            <Route path="resolved" element={<ResolvedComplaints />} />
            <Route path="rejected" element={<RejectedComplaints />} />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="ADMIN">
              <Layout>
                <AdminComplaints />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="ADMIN">
              <Layout>
                <UsersList />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
