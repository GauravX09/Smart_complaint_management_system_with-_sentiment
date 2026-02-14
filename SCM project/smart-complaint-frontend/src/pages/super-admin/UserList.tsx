import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  Search,
  Download,
  Shield,
  Trash2,
  Ban,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  id: number;
  name: string;
  email: string;
  department: string | null;
  phoneNumber: string;
  status: "APPROVED" | "REJECTED" | "BLOCKED";
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/super-admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER USERS ================= */
  const filteredUsers = useMemo(() => {
    setPage(1);
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchDept =
        department === "ALL" || u.department === department;

      const matchStatus =
        status === "ALL" || u.status === status;

      return matchSearch && matchDept && matchStatus;
    });
  }, [users, search, department, status]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  /* ================= UNIQUE DEPARTMENTS ================= */
  const departments = useMemo(() => {
    const result: string[] = [];
    users.forEach((u) => {
      if (u.department && !result.includes(u.department)) {
        result.push(u.department);
      }
    });
    return result;
  }, [users]);

  /* ================= ACTIONS ================= */
  const promoteToAdmin = async (id: number) => {
    if (!window.confirm("Promote this user to Admin?")) return;
    try {
      await API.put(`/api/super-admin/users/${id}/promote`);
      toast.success("User promoted to Admin");
      fetchUsers();
    } catch {
      toast.error("Promotion failed");
    }
  };

  const removeUser = async (id: number) => {
    if (!window.confirm("Remove this user permanently?")) return;
    try {
      await API.delete(`/api/super-admin/users/${id}`);
      toast.success("User removed");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const blockUser = async (id: number) => {
    if (!window.confirm("Block this user?")) return;
    try {
      await API.put(`/api/super-admin/users/${id}/block`);
      toast.success("User blocked");
      fetchUsers();
    } catch {
      toast.error("Block failed");
    }
  };

  const unblockUser = async (id: number) => {
    if (!window.confirm("Unblock this user?")) return;
    try {
      await API.put(`/api/super-admin/users/${id}/unblock`);
      toast.success("User unblocked");
      fetchUsers();
    } catch {
      toast.error("Unblock failed");
    }
  };

  /* ================= EXPORT CSV ================= */
  const exportCSV = () => {
    if (filteredUsers.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Department", "Phone", "Status"];
    const rows = filteredUsers.map((u) => [
      u.name,
      u.email,
      u.department ?? "",
      u.phoneNumber,
      u.status,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="p-6 space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User List</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
        >
          <Download size={16} /> Export CSV
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border rounded-lg px-4 py-2"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="ALL">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
      </div>

      {/* TABLE + STICKY HEADER + STICKY FOOTER */}
      <div className="bg-white rounded-xl shadow flex flex-col h-[70vh]">

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u) => (
                    <motion.tr
                      key={u.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.2 }}
                      className="text-center border-t"
                    >
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.department ?? "—"}</td>
                      <td className="p-3">{u.phoneNumber}</td>
                      <td className="p-3">
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        {u.status === "APPROVED" && (
                          <>
                            <Shield
                              onClick={() => promoteToAdmin(u.id)}
                              className="cursor-pointer text-indigo-600"
                            />
                            <Trash2
                              onClick={() => removeUser(u.id)}
                              className="cursor-pointer text-red-600"
                            />
                          </>
                        )}
                        {u.status === "REJECTED" && (
                          <>
                            <Trash2
                              onClick={() => removeUser(u.id)}
                              className="cursor-pointer text-red-600"
                            />
                            <Ban
                              onClick={() => blockUser(u.id)}
                              className="cursor-pointer text-yellow-600"
                            />
                          </>
                        )}
                        {u.status === "BLOCKED" && (
                          <Unlock
                            onClick={() => unblockUser(u.id)}
                            className="cursor-pointer text-green-600"
                          />
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* 🔒 STICKY FOOTER */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex items-center justify-between text-sm text-gray-600 z-20">
          <div className="flex items-center gap-2">
            Rows per page:
            <select
              className="border rounded px-2 py-1"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1 rounded disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span>
              Page {page} of {totalPages || 1}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserList;
