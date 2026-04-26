import { useState, useEffect } from "react";

const monthlyRevenue = [
  { month: "Oct", revenue: 3.1, sales: 28 },
  { month: "Nov", revenue: 3.4, sales: 31 },
  { month: "Dec", revenue: 4.8, sales: 44 },
  { month: "Jan", revenue: 3.2, sales: 29 },
  { month: "Feb", revenue: 3.7, sales: 34 },
  { month: "Mar", revenue: 4.1, sales: 38 },
  { month: "Apr", revenue: 4.2, sales: 38 },
];

const categoryBreakdown = [
  { label: "Sedan", percentage: 32, color: "#d4af37" },
  { label: "SUV", percentage: 28, color: "#1a1a1a" },
  { label: "Electric", percentage: 18, color: "#4a9d6f" },
  { label: "Hybrid", percentage: 14, color: "#8b7355" },
  { label: "Luxury", percentage: 8, color: "#9b8ea0" },
];

const kpiData = [
  {
    label: "Avg. Deal Size",
    value: "$94,200",
    change: "+8.3%",
    positive: true,
    icon: "ri-money-dollar-circle-line",
  },
  {
    label: "Conversion Rate",
    value: "68%",
    change: "+4.1%",
    positive: true,
    icon: "ri-percent-line",
  },
  {
    label: "Repeat Buyers",
    value: "41%",
    change: "+6.2%",
    positive: true,
    icon: "ri-user-heart-line",
  },
  {
    label: "Avg. Days to Sell",
    value: "11 days",
    change: "-2 days",
    positive: true,
    icon: "ri-calendar-check-line",
  },
];

export default function CompanyChartSection() {
  const [animated, setAnimated] = useState(false);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="company-data" className="py-20 md:py-28 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 border border-white/20 text-white/60 text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Company Analytics
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Live Company
              <br />
              <span className="text-[#d4af37]">Performance Data</span>
            </h2>
            <p className="text-white/50 text-sm mt-3 max-w-md">
              Real-time insights into Pacific Crowns&apos; sales performance,
              revenue trends, and market position.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            <span className="text-emerald-400 text-xs font-semibold">
              Live — Updated Apr 7, 2026
            </span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiData.map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#d4af37]/20">
                  <i className={`${kpi.icon} text-[#d4af37] text-base`}></i>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.positive ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}
                >
                  {kpi.change}
                </span>
              </div>
              <p className="text-white font-black text-2xl">{kpi.value}</p>
              <p className="text-white/40 text-xs mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold text-base">
                  Monthly Revenue
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  Oct 2025 — Apr 2026 (in millions USD)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#d4af37] inline-block"></span>
                  <span className="text-white/50 text-xs">Revenue</span>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-3 h-48 relative">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between h-full pr-2 text-right">
                {[5, 4, 3, 2, 1, 0].map((v) => (
                  <span key={v} className="text-white/30 text-[10px]">
                    ${v}M
                  </span>
                ))}
              </div>

              {/* Bars */}
              <div className="flex-1 flex items-end gap-2 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-full border-t border-white/5"
                    ></div>
                  ))}
                </div>

                {monthlyRevenue.map((item, i) => {
                  const heightPct = (item.revenue / 5) * 100;
                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                    >
                      {/* Tooltip */}
                      {activeBar === i && (
                        <div className="absolute bottom-full mb-2 bg-white text-[#1a1a1a] text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                          ${item.revenue}M — {item.sales} vehicles
                        </div>
                      )}
                      <div
                        className="w-full relative flex items-end"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="w-full rounded-t-lg transition-all duration-700 ease-out"
                          style={{
                            height: animated ? `${heightPct}%` : "0%",
                            backgroundColor:
                              activeBar === i ? "#f0cc5a" : "#d4af37",
                            opacity:
                              activeBar !== null && activeBar !== i ? 0.4 : 1,
                          }}
                        ></div>
                      </div>
                      <span className="text-white/40 text-[10px] mt-1">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white/40 text-xs">Total 7-Month Revenue</p>
                <p className="text-white font-black text-xl mt-0.5">$26.5M</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs">YoY Growth</p>
                <p className="text-emerald-400 font-black text-xl mt-0.5">
                  +22.4%
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs">Total Vehicles Sold</p>
                <p className="text-[#d4af37] font-black text-xl mt-0.5">242</p>
              </div>
            </div>
          </div>

          {/* Category Donut + Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-white font-bold text-base">
                Sales by Category
              </h3>
              <p className="text-white/40 text-xs mt-0.5">2026 Year-to-Date</p>
            </div>

            {/* Donut Chart (CSS) */}
            <div className="flex justify-center mb-6">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {
                    categoryBreakdown.reduce<{
                      segments: React.ReactNode[];
                      offset: number;
                    }>(
                      (acc, cat, i) => {
                        const circumference = 2 * Math.PI * 15.9;
                        const dashArray =
                          (cat.percentage / 100) * circumference;
                        acc.segments.push(
                          <circle
                            key={cat.label}
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            stroke={cat.color}
                            strokeWidth="3.5"
                            strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                            strokeDashoffset={-acc.offset}
                            className="transition-all duration-700"
                            style={{
                              opacity:
                                activeCategory !== null && activeCategory !== i
                                  ? 0.3
                                  : 1,
                            }}
                            onMouseEnter={() => setActiveCategory(i)}
                            onMouseLeave={() => setActiveCategory(null)}
                          />,
                        );
                        acc.offset += dashArray;
                        return acc;
                      },
                      { segments: [], offset: 0 },
                    ).segments
                  }
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-white font-black text-lg">
                    {activeCategory !== null
                      ? `${categoryBreakdown[activeCategory].percentage}%`
                      : "100%"}
                  </p>
                  <p className="text-white/40 text-[10px]">
                    {activeCategory !== null
                      ? categoryBreakdown[activeCategory].label
                      : "Total"}
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3">
              {categoryBreakdown.map((cat, i) => (
                <div
                  key={cat.label}
                  className="flex items-center justify-between cursor-pointer"
                  onMouseEnter={() => setActiveCategory(i)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="text-white/70 text-xs">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: animated ? `${cat.percentage}%` : "0%",
                          backgroundColor: cat.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-bold text-xs w-8 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Position */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-white/40 text-xs mb-3">
                Market Position — Beverly Hills
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#d4af37] transition-all duration-1000"
                    style={{ width: animated ? "78%" : "0%" }}
                  ></div>
                </div>
                <span className="text-[#d4af37] font-black text-sm">#1</span>
              </div>
              <p className="text-white/30 text-[10px] mt-1">
                78% market share in luxury segment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
