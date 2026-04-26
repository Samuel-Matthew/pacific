const dashboardStats = [
  {
    icon: "ri-car-line",
    value: "248",
    label: "Vehicles in Stock",
    change: "+12 this month",
    positive: true,
  },
  {
    icon: "ri-user-star-line",
    value: "2,400+",
    label: "Happy Customers",
    change: "+87 this year",
    positive: true,
  },
  {
    icon: "ri-trophy-line",
    value: "15",
    label: "Industry Awards",
    change: "Best Dealer 2024",
    positive: true,
  },
  {
    icon: "ri-star-line",
    value: "4.9/5",
    label: "Average Rating",
    change: "Based on 1,200+ reviews",
    positive: true,
  },
  {
    icon: "ri-exchange-dollar-line",
    value: "$2.4M+",
    label: "Trade-In Value Paid",
    change: "This year",
    positive: true,
  },
  {
    icon: "ri-time-line",
    value: "< 2hrs",
    label: "Avg. Purchase Time",
    change: "Streamlined process",
    positive: true,
  },
];

const recentSales = [
  {
    vehicle: "2024 BMW 7 Series",
    buyer: "M. Thompson",
    price: "$89,900",
    date: "Apr 5, 2026",
    status: "Completed",
  },
  {
    vehicle: "2023 Mercedes GLE 450",
    buyer: "S. Reyes",
    price: "$74,500",
    date: "Apr 4, 2026",
    status: "Completed",
  },
  {
    vehicle: "2024 Tesla Model S",
    buyer: "D. Chen",
    price: "$79,990",
    date: "Apr 3, 2026",
    status: "Completed",
  },
  {
    vehicle: "2023 Range Rover Sport",
    buyer: "A. Williams",
    price: "$82,400",
    date: "Apr 2, 2026",
    status: "Completed",
  },
  {
    vehicle: "2024 Porsche Cayenne",
    buyer: "R. Johnson",
    price: "$96,200",
    date: "Apr 1, 2026",
    status: "Pending",
  },
];

const popularModels = [
  { name: "BMW 7 Series", sold: 42, percentage: 85 },
  { name: "Mercedes GLE", sold: 38, percentage: 76 },
  { name: "Porsche Cayenne", sold: 31, percentage: 62 },
  { name: "Tesla Model S", sold: 28, percentage: 56 },
  { name: "Range Rover Sport", sold: 24, percentage: 48 },
];

export default function DashboardSection() {
  return (
    <section id="dashboard" className="py-20 md:py-28 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Live Overview
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight">
              Dealership
              <br />
              <span className="text-[#d4af37]">Dashboard</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            <span className="text-emerald-700 text-xs font-semibold">
              Live Data — Updated Today
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {dashboardStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f0f0f0]">
                <i className={`${stat.icon} text-[#1a1a1a] text-base`}></i>
              </div>
              <div>
                <p className="text-[#1a1a1a] font-black text-xl">
                  {stat.value}
                </p>
                <p className="text-[#6b6b6b] text-xs mt-0.5">{stat.label}</p>
              </div>
              <p
                className={`text-xs font-medium ${stat.positive ? "text-emerald-600" : "text-rose-500"}`}
              >
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sales */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#1a1a1a] font-bold text-base">
                Recent Transactions
              </h3>
              <span className="text-[#6b6b6b] text-xs">April 2026</span>
            </div>
            <div className="flex flex-col gap-3">
              {recentSales.map((sale, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#f0f0f0] flex-shrink-0">
                      <i className="ri-car-line text-[#1a1a1a] text-sm"></i>
                    </div>
                    <div>
                      <p className="text-[#1a1a1a] text-sm font-semibold">
                        {sale.vehicle}
                      </p>
                      <p className="text-[#6b6b6b] text-xs">
                        {sale.buyer} &bull; {sale.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#1a1a1a] font-bold text-sm">
                      {sale.price}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        sale.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Models */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#1a1a1a] font-bold text-base">Top Models</h3>
              <span className="text-[#6b6b6b] text-xs">2026 YTD</span>
            </div>
            <div className="flex flex-col gap-5">
              {popularModels.map((model, i) => (
                <div key={model.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#1a1a1a] text-sm font-medium">
                      {model.name}
                    </span>
                    <span className="text-[#6b6b6b] text-xs">
                      {model.sold} sold
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${model.percentage}%`,
                        backgroundColor:
                          i === 0 ? "#d4af37" : i === 1 ? "#1a1a1a" : "#6b6b6b",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick CTA */}
            <div className="mt-8 p-4 bg-[#1a1a1a] rounded-xl text-center">
              <p className="text-white text-sm font-semibold mb-1">
                Ready to Join Our List?
              </p>
              <p className="text-white/50 text-xs mb-3">
                Schedule your visit today
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full py-2.5 bg-[#d4af37] text-[#1a1a1a] text-xs font-bold rounded-lg hover:bg-[#c9a227] transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
