import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type AuditLog = {
  id: number;
  userId: number;
  action: string;
  performedBy: string;
  performedAt: string;
  remarks: string;
};

/* ================= ANIMATIONS ================= */

const rowAnim = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
};

/* ================= COMPONENT ================= */

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== PAGINATION STATE ===== */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/api/super-admin/audit-logs");
      setLogs(res.data);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PAGINATION LOGIC ================= */

  const totalPages = Math.ceil(logs.length / pageSize);

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return logs.slice(start, start + pageSize);
  }, [logs, page, pageSize]);

  /* ================= BADGE COLORS ================= */

  const badgeColor = (action: string) => {
    if (action.includes("APPROVED")) return "bg-green-100 text-green-700";
    if (action.includes("REJECTED")) return "bg-red-100 text-red-700";
    if (action.includes("BLOCKED")) return "bg-orange-100 text-orange-700";
    if (action.includes("UNBLOCKED")) return "bg-emerald-100 text-emerald-700";
    if (action.includes("DELETED")) return "bg-gray-200 text-gray-700";
    if (action.includes("PROMOTED")) return "bg-blue-100 text-blue-700";
    if (action.includes("DEMOTED")) return "bg-purple-100 text-purple-700";
    return "bg-sky-100 text-sky-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold">Audit Logs</h1>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Performed By</th>
              <th className="p-3 text-left">Timestamp</th>
              <th className="p-3 text-left">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Loading audit logs...
                </td>
              </tr>
            )}

            {!loading && paginatedLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No audit logs found
                </td>
              </tr>
            )}

            <AnimatePresence>
              {paginatedLogs.map((log) => (
                <motion.tr
                  key={log.id}
                  variants={rowAnim}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ backgroundColor: "#F9FAFB" }}
                  className="border-t"
                >
                  <td className="p-3 font-medium">{log.userId}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${badgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3">{log.performedBy}</td>

                  <td className="p-3">
                    {new Date(log.performedAt).toLocaleString()}
                  </td>

                  <td className="p-3">{log.remarks || "—"}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION CONTROLS ================= */}
      {!loading && logs.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Page Size */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded-lg px-3 py-1"
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Page Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AuditLogs;
