import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/context/ToastContext";
import {
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  type AdminUser,
} from "@/api/admin";

const ROLES = ["user", "admin", "moderator"];
const STATUSES = ["active", "suspended", "banned"];

export default function UsersTab() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch {
      addToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      const updated = await updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      addToast("Role updated", "success");
    } catch {
      addToast("Failed to update role", "error");
    }
  };

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      const updated = await updateUserStatus(userId, status);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      addToast("Status updated", "success");
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (userId: string) => {
    setDeleting(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      addToast("User deleted", "success");
    } catch {
      addToast("Failed to delete user", "error");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Users</h2>
          <p className="text-white/60 text-sm">{total} total users</p>
        </div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search name / email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500 transition-colors w-full sm:w-52"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm h-10 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">
              All Roles
            </option>
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-slate-900">
                {r}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-2 text-sm h-10 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">
              All Statuses
            </option>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="bg-slate-900">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left text-white/70 font-medium px-2 md:px-5 py-2 md:py-3">
                  User
                </th>
                <th className="text-left text-white/70 font-medium px-2 md:px-5 py-2 md:py-3 hidden md:table-cell">
                  Role
                </th>
                <th className="text-left text-white/70 font-medium px-2 md:px-5 py-2 md:py-3 hidden md:table-cell">
                  Status
                </th>
                <th className="text-left text-white/70 font-medium px-2 md:px-5 py-2 md:py-3">
                  Joined
                </th>
                <th className="text-left text-white/70 font-medium px-2 md:px-5 py-2 md:py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="px-2 md:px-5 py-2 md:py-4">
                      <div
                        className="h-4 rounded bg-white/10 animate-pulse"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4 hidden md:table-cell">
                      <div
                        className="h-4 rounded bg-white/10 animate-pulse"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4 hidden md:table-cell">
                      <div
                        className="h-4 rounded bg-white/10 animate-pulse"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4">
                      <div
                        className="h-4 rounded bg-white/10 animate-pulse"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4">
                      <div
                        className="h-4 rounded bg-white/10 animate-pulse"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-white/40 py-12">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-2 md:px-5 py-2 md:py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium leading-tight text-xs md:text-sm truncate">
                            {u.name}
                          </p>
                          <p className="text-white/50 text-xs hidden md:block">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4 hidden md:table-cell">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1 text-xs h-8 cursor-pointer focus:outline-none focus:border-amber-500 hover:border-white/20 transition-colors"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} className="bg-slate-900">
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4 hidden md:table-cell">
                      <select
                        value={u.status}
                        onChange={(e) =>
                          handleStatusChange(u.id, e.target.value)
                        }
                        className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1 text-xs h-8 cursor-pointer focus:outline-none focus:border-amber-500 hover:border-white/20 transition-colors"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-slate-900">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4 text-white/60 text-xs whitespace-nowrap\">
                      {new Date(u.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-2 md:px-5 py-2 md:py-4\">
                      <button
                        onClick={() => setConfirmDelete(u)}
                        className="text-white/50 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 h-8 w-8 flex items-center justify-center"
                        title="Delete user"
                      >
                        <i className="ri-delete-bin-line\"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
            <p className="text-white/60 text-xs">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-3xl mb-3">
              <i className="ri-lg ri-error-warning-fill text-amber-400"></i>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Delete User</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {confirmDelete.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold transition-colors text-sm disabled:opacity-60"
              >
                {deleting === confirmDelete.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
