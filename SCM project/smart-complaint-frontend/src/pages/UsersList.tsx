// src/pages/UsersList.tsx

import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string | null;
};

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔐 Uses JWT-secured axios request
      const res = await API.get<User[]>("/api/users/all");

      setUsers(res.data || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load users.");
      toast.error("Unable to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

        <button
          onClick={fetchUsers}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="p-6 bg-white rounded shadow">Loading users…</div>
      ) : error ? (
        <div className="p-6 bg-yellow-50 text-red-700 rounded shadow">{error}</div>
      ) : users.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.name ?? "—"}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-sm rounded ${
                        u.role === "ADMIN"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;
