import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "@/context/useAuth";
import AdminSidebar from "../../pages/admin/components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({
  children,
  title,
  description,
}: AdminLayoutProps) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static left-0 top-0 h-full z-40
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 bg-slate-900 min-h-screen ${
          collapsed ? "lg:ml-0" : "lg:ml-0"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-800 border-b border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-white/70"
              aria-label="Toggle sidebar"
            >
              <i
                className={`ri-${sidebarOpen ? "close" : "menu"}-line text-xl`}
              ></i>
            </button>

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm text-white/60 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Right side info */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-700 text-xs font-medium">
                {user?.name}
              </span>
            </div>
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100 text-sm border border-gray-200 flex items-center gap-1"
              title="Back to site"
            >
              <span className="hidden sm:inline">← Back</span>
              <i className="ri-arrow-left-line sm:hidden"></i>
            </a>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
