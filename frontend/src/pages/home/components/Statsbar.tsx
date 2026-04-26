const stats = [
  { icon: "ri-award-line", value: "15+", label: "Years of Excellence" },
  { icon: "ri-car-line", value: "2,400+", label: "Vehicles Sold" },
  { icon: "ri-user-smile-line", value: "98%", label: "Customer Satisfaction" },
  { icon: "ri-shield-star-line", value: "50+", label: "Premium Brands" },
];

export default function StatsBar() {
  return (
    <div className="bg-[#1a1a1a] py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col md:flex-row items-center md:justify-center gap-3 md:gap-4 px-4"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#d4af37]/20 flex-shrink-0">
                <i className={`${stat.icon} text-[#d4af37] text-lg`}></i>
              </div>
              <div className="text-center md:text-left">
                <p className="text-white font-black text-2xl leading-none">
                  {stat.value}
                </p>
                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
