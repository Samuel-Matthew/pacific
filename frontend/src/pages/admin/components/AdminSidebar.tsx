import { useAuth } from "@/context/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

type Tab = "overview" | "users" | "partnerships" | "payments" | "contacts";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

const navItems: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "ri-dashboard-line" },
  { id: "users", label: "Users", icon: "ri-team-line" },
  { id: "partnerships", label: "Partnerships", icon: "ri-shake-hands-line" },
  { id: "payments", label: "Payments", icon: "ri-bank-card-line" },
  { id: "contacts", label: "Contact Info", icon: "ri-phone-line" },
];

export default function AdminSidebar({
  collapsed,
  onToggle,
  onNavigate,
}: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = (): Tab => {
    const path = location.pathname;
    if (path === "/admin/users") return "users";
    if (path === "/admin/partnerships") return "partnerships";
    if (path === "/admin/payments") return "payments";
    if (path === "/admin/contacts") return "contacts";
    return "overview";
  };

  const handleNavigation = (tab: Tab) => {
    const paths: Record<Tab, string> = {
      overview: "/admin/overview",
      users: "/admin/users",
      partnerships: "/admin/partnerships",
      payments: "/admin/payments",
      contacts: "/admin/contacts",
    };
    navigate(paths[tab]);
    onNavigate?.();
  };

  const active = getActiveTab();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        border-r border-white/10 shadow-2xl
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              PC
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">
                Pacific Crowns
              </p>
              <p className="text-slate-400 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm mx-auto">
            PC
          </div>
        )}
        <button
          onClick={onToggle}
          className={`text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 ${collapsed ? "hidden" : ""}`}
        >
          <i className="ri-arrow-left-s-line text-lg"></i>
        </button>
      </div>

      {collapsed && (
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors p-2 mx-auto mt-2 rounded-lg hover:bg-white/10"
        >
          <i className="ri-arrow-right-s-line text-lg"></i>
        </button>
      )}

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            title={collapsed ? item.label : undefined}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 group
              ${
                active === item.id
                  ? "bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }
            `}
          >
            <i className={`${item.icon} text-base flex-shrink-0`}></i>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Info + Logout */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">
                {user.name}
              </p>
              <p className="text-slate-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <i className="ri-logout-box-r-line text-base flex-shrink-0"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
