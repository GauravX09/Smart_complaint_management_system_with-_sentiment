import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import {
  Search,
  UserMinus,
  Ban,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Admin {
  id: number;
  name: string | null;
  department: string | null;
  phoneNumber: string | null;
  status: "APPROVED" | "BLOCKED";
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");

  // pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await API.get("/api/super-admin/admins");
      setAdmins(res.data);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredAdmins = useMemo(() => {
    setPage(1);
    return admins.filter((a) => {
      const matchSearch =
        a.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
      const matchDept =
        department === "ALL" || a.department === department;
      return matchSearch && matchDept;
    });
  }, [admins, search, department]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredAdmins.length / rowsPerPage);

  const paginatedAdmins = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredAdmins.slice(start, start + rowsPerPage);
  }, [filteredAdmins, page, rowsPerPage]);

  /* ================= ACTIONS ================= */
  const demoteAdmin = async (id: number) => {
    if (!window.confirm("Demote this admin to USER?")) return;
    try {
      await API.put(`/api/super-admin/admins/${id}/demote`);
      toast.success("Admin demoted to USER");
      fetchAdmins();
    } catch {
      toast.error("Demotion failed");
    }
  };

  const blockAdmin = async (id: number) => {
    if (!window.confirm("Block this admin?")) return;
    try {
      await API.put(`/api/super-admin/users/${id}/block`);
      toast.success("Admin blocked");
      fetchAdmins();
    } catch {
      toast.error("Block failed");
    }
  };

  const unblockAdmin = async (id: number) => {
    if (!window.confirm("Unblock this admin?")) return;
    try {
      await API.put(`/api/super-admin/users/${id}/unblock`);
      toast.success("Admin unblocked");
      fetchAdmins();
    } catch {
      toast.error("Unblock failed");
    }
  };

  return (
    <motion.div
      className="p-6 space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <h1 className="text-2xl font-bold">Admin List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search name"
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
          <option value="ENGINEERING">ENGINEERING</option>
          <option value="LAW">LAW</option>
          <option value="BUSINESS">BUSINESS</option>
          <option value="HOTEL">HOTEL</option>
          <option value="SPORTS">SPORTS</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-auto max-h-[65vh]">
        <table className="min-w-full">
          {/* Sticky Header */}
          <thead className="bg-gray-100 sticky top-0 z-20 shadow-sm">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Loading admins...
                  </td>
                </tr>
              ) : paginatedAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No admins found
                  </td>
                </tr>
              ) : (
                paginatedAdmins.map((a) => (
                  <motion.tr
                    key={a.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className="border-t text-sm"
                  >
                    <td className="p-3">{a.id}</td>
                    <td className="p-3 font-medium">{a.name ?? "—"}</td>
                    <td className="p-3">{a.department ?? "—"}</td>
                    <td className="p-3">
                      {a.phoneNumber || "NOT_PROVIDED"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          a.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {a.status === "APPROVED" && (
                        <>
                          <button
                            onClick={() => demoteAdmin(a.id)}
                            className="px-3 py-1 rounded bg-yellow-500 text-white text-xs"
                          >
                            <UserMinus size={14} />
                          </button>
                          <button
                            onClick={() => blockAdmin(a.id)}
                            className="px-3 py-1 rounded bg-red-600 text-white text-xs"
                          >
                            <Ban size={14} />
                          </button>
                        </>
                      )}

                      {a.status === "BLOCKED" && (
                        <button
                          onClick={() => unblockAdmin(a.id)}
                          className="px-3 py-1 rounded bg-green-600 text-white text-xs"
                        >
                          <Unlock size={14} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Sticky Pagination Footer */}
      <div className="flex items-center justify-between text-sm text-gray-600 sticky bottom-0 bg-gray-50 p-3 rounded-xl shadow">
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
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <span>
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminList;
