import { useState } from "react";

const services = [
  {
    icon: "ri-car-line",
    title: "New Vehicle Sales",
    description:
      "Browse our extensive collection of brand-new luxury and performance vehicles from the world's most prestigious manufacturers. Every model comes with full warranty coverage.",
    features: [
      "Full Manufacturer Warranty",
      "Latest Models Available",
      "Custom Orders Welcome",
    ],
  },
  {
    icon: "ri-shield-check-line",
    title: "Certified Pre-Owned",
    description:
      "Our certified pre-owned vehicles undergo a rigorous 150-point inspection process, ensuring you receive a vehicle that meets the highest standards of quality and reliability.",
    features: [
      "150-Point Inspection",
      "Vehicle History Report",
      "Extended Warranty Options",
    ],
  },
  {
    icon: "ri-bank-card-line",
    title: "Flexible Financing",
    description:
      "We partner with leading financial institutions to offer competitive financing rates tailored to your budget. Our finance specialists will find the best solution for you.",
    features: [
      "Low Interest Rates",
      "Flexible Terms",
      "Quick Approval Process",
    ],
  },
  {
    icon: "ri-tools-line",
    title: "Service & Maintenance",
    description:
      "Our state-of-the-art service center is staffed by factory-trained technicians who use only genuine parts to keep your vehicle performing at its absolute best.",
    features: [
      "Factory-Trained Technicians",
      "Genuine OEM Parts",
      "Express Service Available",
    ],
  },
  {
    icon: "ri-exchange-line",
    title: "Trade-In Program",
    description:
      "Get the best value for your current vehicle with our transparent trade-in program. We offer fair market valuations and seamless transitions to your next dream car.",
    features: [
      "Fair Market Valuation",
      "Instant Online Quote",
      "Seamless Process",
    ],
  },
  {
    icon: "ri-customer-service-2-line",
    title: "Concierge Service",
    description:
      "Experience automotive luxury beyond the vehicle itself. Our dedicated concierge team handles everything from delivery scheduling to personalized vehicle setup.",
    features: [
      "Home Delivery Available",
      "Personal Vehicle Setup",
      "24/7 Support Line",
    ],
  },
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 md:py-28 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight mb-4">
            Comprehensive Automotive
            <br />
            <span className="text-[#d4af37]">Services</span>
          </h2>
          <p className="text-[#6b6b6b] text-base max-w-xl mx-auto">
            From purchase to maintenance, Pacific Crowns provides a complete
            suite of services designed around your needs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group rounded-2xl p-7 transition-all duration-300 cursor-default ${
                hoveredIndex === index
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a]"
              }`}
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl mb-5 transition-all duration-300 ${
                  hoveredIndex === index ? "bg-[#d4af37]" : "bg-[#f0f0f0]"
                }`}
              >
                <i
                  className={`${service.icon} text-2xl transition-colors duration-300 ${
                    hoveredIndex === index ? "text-[#1a1a1a]" : "text-[#1a1a1a]"
                  }`}
                ></i>
              </div>
              <h3
                className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                  hoveredIndex === index ? "text-white" : "text-[#1a1a1a]"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-5 transition-colors duration-300 ${
                  hoveredIndex === index ? "text-white/70" : "text-[#6b6b6b]"
                }`}
              >
                {service.description}
              </p>
              <ul className="flex flex-col gap-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                      hoveredIndex === index
                        ? "text-white/80"
                        : "text-[#6b6b6b]"
                    }`}
                  >
                    <i
                      className={`ri-check-line text-sm transition-colors duration-300 ${
                        hoveredIndex === index
                          ? "text-[#d4af37]"
                          : "text-emerald-500"
                      }`}
                    ></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
