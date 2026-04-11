import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

type UserRow = {
  id: number;
  name: string;
  email: string;
  total: number;
  pending: number;
  resolved: number;
  blocked?: boolean;
};

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email;

      if (!email) {
        toast.error("Admin email not found");
        return;
      }

      const res = await API.get(`/api/complaints/admin?email=${email}`);
      const complaints = res.data || [];

      const userMap: Record<string, UserRow> = {};

      complaints.forEach((c: any) => {
        if (!userMap[c.userEmail]) {
          userMap[c.userEmail] = {
            id: c.id,
            name: c.userName || "Unknown",
            email: c.userEmail,
            total: 0,
            pending: 0,
            resolved: 0,
            blocked: false, // default
          };
        }

        userMap[c.userEmail].total++;

        if (c.status === "PENDING") userMap[c.userEmail].pending++;
        if (c.status === "RESOLVED") userMap[c.userEmail].resolved++;
      });

      setUsers(Object.values(userMap));

    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BLOCK / UNBLOCK ================= */

  const toggleBlockUser = async (user: UserRow) => {
    try {
      if (user.blocked) {
        await API.put(`/api/users/unblock/${user.id}`);
        toast.success("User unblocked");
      } else {
        await API.put(`/api/users/block/${user.id}`);
        toast.success("User blocked");
      }

      // ✅ update UI instantly (no reload needed)
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, blocked: !u.blocked } : u
        )
      );

    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Department Users</h2>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total</th>
            <th>Pending</th>
            <th>Resolved</th>
            <th>Action</th> {/* ✅ NEW */}
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.email} className="border-t">
              <td className="p-3">{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.total}</td>
              <td className="text-yellow-600">{u.pending}</td>
              <td className="text-green-600">{u.resolved}</td>

              {/* ✅ BUTTON */}
              <td>
                <button
                  onClick={() => toggleBlockUser(u)}
                  className={`px-3 py-1 rounded text-white ${
                    u.blocked
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {u.blocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;