import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import PartnershipsTab from "./components/PartnershipsTab";

export default function AdminPartnerships() {
  const { user, isInitialized } = useAuth();

  // Guard: wait for auth initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-12 h-12 border-4 border-red/20 border-t-amber-400 rounded-full"></div>
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
      title="Partnerships"
      description="Review and manage partnership applications"
    >
      <PartnershipsTab />
    </AdminLayout>
  );
}
