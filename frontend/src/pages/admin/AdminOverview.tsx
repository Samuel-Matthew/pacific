import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import StatsOverview from "./components/StatsOverview";
import { useNavigate } from "react-router-dom";

export default function AdminOverview() {
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();

  // Guard: wait for auth initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-amber-400 rounded-full"></div>
          </div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Guard: must be logged in and have admin role
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout
      title="Dashboard Overview"
      description="Pacific Crowns · Admin Panel"
    >
      <div className="space-y-8">
        <StatsOverview />

        {/* Quick links */}
        <div>
          <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="group rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5 text-left hover:border-blue-300 hover:scale-[1.02] transition-all duration-200"
            >
              <div className="text-2xl mb-3">👥</div>
              <p className="text-gray-900 font-semibold">Manage Users</p>
              <p className="text-gray-600 text-sm mt-1">
                View, edit roles, suspend or delete users
              </p>
            </button>
            <button
              onClick={() => navigate("/admin/partnerships")}
              className="group rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5 text-left hover:border-amber-300 hover:scale-[1.02] transition-all duration-200"
            >
              <div className="text-2xl mb-3">🤝</div>
              <p className="text-gray-900 font-semibold">Manage Partnerships</p>
              <p className="text-gray-600 text-sm mt-1">
                Review, approve or reject partnership requests
              </p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
