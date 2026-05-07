import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/api/admin";

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  bg: string;
  textColor: string;
  trend?: string;
}

function Skeleton() {
  return <div className="h-6 w-20 rounded-md bg-white/10 animate-pulse" />;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  const cards: StatCard[] = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers.toLocaleString(),
          icon: "ri-team-fill",
          color: "text-blue-400",
          textColor: "text-blue-300",
          bg: "bg-blue-500/10 border-blue-500/30",
          trend: `+${stats.newUsersThisMonth} this month`,
        },
        {
          label: "Active Users",
          value: stats.activeUsers.toLocaleString(),
          icon: "ri-check-double-fill",
          color: "text-emerald-400",
          textColor: "text-emerald-300",
          bg: "bg-emerald-500/10 border-emerald-500/30",
          trend: `${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total`,
        },
        {
          label: "Partnerships",
          value: stats.totalPartnerships.toLocaleString(),
          icon: "ri-handshake-2-fill",
          color: "text-amber-400",
          textColor: "text-amber-300",
          bg: "bg-amber-500/10 border-amber-500/30",
          trend: `${stats.approvedPartnerships} approved`,
        },
        {
          label: "Pending Reviews",
          value: stats.pendingPartnerships.toLocaleString(),
          icon: "ri-hourglass-2-fill",
          color: "text-orange-400",
          textColor: "text-orange-300",
          bg: "bg-orange-500/10 border-orange-500/30",
          trend: "Awaiting action",
        },
      ]
    : [];

  return (
    <div>
      <h2 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
        Overview
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-800 border border-white/10 p-5 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10" />
                  <div className="h-4 w-16 rounded bg-white/10" />
                </div>
                <div className="h-7 w-24 rounded bg-white/10 mb-2" />
                <div className="h-4 w-28 rounded bg-white/10" />
              </div>
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl ${card.bg} border p-5 group hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <i className={`ri-lg ${card.icon} ${card.color}`}></i>
                  <span
                    className={`text-xs font-medium ${card.color} bg-white/5 px-2 py-1 rounded-full`}
                  >
                    {card.trend}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${card.color} mb-1`}>
                  {loading ? <Skeleton /> : card.value}
                </p>
                <p className="text-white/60 text-sm">{card.label}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
