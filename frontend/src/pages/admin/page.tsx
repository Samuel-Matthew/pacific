import { useState } from "react";
import { useAuth } from "@/context/useAuth";
import { Navigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import StatsOverview from "./components/StatsOverview";
import UsersTab from "./components/UsersTab";
import PartnershipsTab from "./components/PartnershipsTab";
import PaymentManagementTab from "./components/PaymentManagementTab";
import ContactInfoTab from "./components/ContactInfoTab";

type Tab = "overview" | "users" | "partnerships" | "payments" | "contacts";

export default function AdminPage() {
  const { user, isInitialized } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [collapsed, setCollapsed] = useState(false);

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
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      {/* Main content */}
      <main
        className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
          <div>
            <h1 className="text-white font-bold text-lg capitalize">
              {tab === "overview"
                ? "Dashboard Overview"
                : tab === "contacts"
                  ? "Contact Information"
                  : tab}
            </h1>
            <p className="text-slate-500 text-xs">
              Pacific Crowns · Admin Panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-xs">{user.name}</span>
            </div>
            <a
              href="/"
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 text-xs border border-white/10"
              title="Back to site"
            >
              ← Site
            </a>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {tab === "overview" && (
            <div className="space-y-8">
              <StatsOverview />

              {/* Quick links */}
              <div>
                <h2 className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setTab("users")}
                    className="group rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-5 text-left hover:border-blue-500/40 hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="text-2xl mb-3">👥</div>
                    <p className="text-white font-semibold">Manage Users</p>
                    <p className="text-slate-500 text-sm mt-1">
                      View, edit roles, suspend or delete users
                    </p>
                  </button>
                  <button
                    onClick={() => setTab("partnerships")}
                    className="group rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 p-5 text-left hover:border-amber-500/40 hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="text-2xl mb-3">🤝</div>
                    <p className="text-white font-semibold">
                      Manage Partnerships
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Review, approve or reject partnership requests
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "users" && <UsersTab />}
          {tab === "partnerships" && <PartnershipsTab />}
          {tab === "payments" && <PaymentManagementTab />}
          {tab === "contacts" && <ContactInfoTab />}
        </div>
      </main>
    </div>
  );
}
