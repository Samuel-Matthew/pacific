const reasons = [
  {
    icon: "ri-verified-badge-line",
    title: "Certified Quality",
    desc: "Every vehicle passes our rigorous 150-point inspection before it reaches our showroom floor. No compromises.",
  },
  {
    icon: "ri-price-tag-3-line",
    title: "Transparent Pricing",
    desc: "No hidden fees, no surprises. Our pricing is clear, fair, and competitive — always.",
  },
  {
    icon: "ri-customer-service-2-line",
    title: "Dedicated Support",
    desc: "Our team of specialists is available 7 days a week to guide you through every step of your purchase.",
  },
  {
    icon: "ri-bank-card-line",
    title: "Flexible Financing",
    desc: "We work with 20+ lenders to find you the best rate, regardless of your credit history.",
  },
  {
    icon: "ri-truck-line",
    title: "White-Glove Delivery",
    desc: "We deliver your vehicle to your home or office, fully detailed and ready to drive.",
  },
  {
    icon: "ri-refresh-line",
    title: "Easy Trade-Ins",
    desc: "Get an instant online valuation for your current vehicle and apply it directly to your next purchase.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 border border-white/20 text-white/60 text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
            Why Pacific Crowns
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            The Pacific Crowns
            <br />
            <span className="text-[#d4af37]">Difference</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            We don&apos;t just sell cars — we craft experiences. Here&apos;s
            what sets us apart from every other dealership.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="group p-7 rounded-2xl border border-white/10 hover:border-[#d4af37]/40 hover:bg-white/5 transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#d4af37]/15 mb-5">
                <i className={`${r.icon} text-[#d4af37] text-xl`}></i>
              </div>
              <h3 className="text-white font-bold text-base mb-2">{r.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
