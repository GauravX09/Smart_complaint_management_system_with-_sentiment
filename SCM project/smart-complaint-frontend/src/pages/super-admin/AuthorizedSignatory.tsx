import React, { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

type PendingUser = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: "USER" | "ADMIN";
  status: "PENDING";
};

const PAGE_SIZE = 10;

const AuthorizedSignatory: React.FC = () => {
  const [requests, setRequests] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  const fetchPendingUsers = async () => {
    try {
      const res = await API.get(
        "/api/super-admin/authorized-signatory/pending"
      );
      setRequests(res.data);
    } catch {
      toast.error("Failed to load pending registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    setPage(1);
    return requests.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
    );
  }, [search, requests]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  /* ================= SELECTION (ES5 SAFE) ================= */
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginated.map((u) => u.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) => {
      if (allSelected) {
        return prev.filter((id) => pageIds.indexOf(id) === -1);
      }

      const merged = prev.slice();
      pageIds.forEach((id) => {
        if (merged.indexOf(id) === -1) {
          merged.push(id);
        }
      });

      return merged;
    });
  };

  /* ================= BULK ACTION ================= */
  const bulkAction = async (action: "approve" | "reject") => {
    if (selectedIds.length === 0) return;

    if (
      action === "reject" &&
      !window.confirm(`Reject ${selectedIds.length} users?`)
    )
      return;

    try {
      setProcessing(true);

      await Promise.all(
        selectedIds.map((id) =>
          API.put(
            `/api/super-admin/authorized-signatory/${id}/${action}`
          )
        )
      );

      toast.success(`${selectedIds.length} users ${action}d`);
      setRequests((prev) =>
        prev.filter((u) => !selectedIds.includes(u.id))
      );
      setSelectedIds([]);
    } catch {
      toast.error("Bulk action failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= UI ================= */
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Authorized Signatory – Pending Registrations
        </h1>

        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <button
              disabled={processing}
              onClick={() => bulkAction("approve")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Approve Selected
            </button>
            <button
              disabled={processing}
              onClick={() => bulkAction("reject")}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Reject Selected
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, department"
          className="pl-10 pr-4 py-2 border rounded-lg w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-auto max-h-[65vh]">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-20 shadow-sm">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    paginated.length > 0 &&
                    paginated.every((u) =>
                      selectedIds.includes(u.id)
                    )
                  }
                />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}

            <AnimatePresence>
              {!loading &&
                paginated.map((u) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`border-t hover:bg-indigo-50 ${
                      selectedIds.includes(u.id)
                        ? "bg-indigo-50"
                        : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(u.id)}
                        onChange={() => toggleSelect(u.id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.department}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                        PENDING
                      </span>
                    </td>
                  </motion.tr>
                ))}
            </AnimatePresence>

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <AlertCircle size={36} className="mx-auto mb-2" />
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center text-sm text-gray-600 sticky bottom-0 bg-white py-2">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 border rounded disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 border rounded disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AuthorizedSignatory;
