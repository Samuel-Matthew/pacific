const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "2,400+", label: "Vehicles Sold" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "50+", label: "Premium Brands" },
];

const brands = [
  "BMW",
  "Mercedes",
  "Porsche",
  "Audi",
  "Tesla",
  "Range Rover",
  "Lexus",
  "Bentley",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden w-full h-[380px] md:h-[480px]">
              <img
                src="https://readdy.ai/api/search-image?query=modern%20luxury%20car%20dealership%20showroom%20interior%20elegant%20lighting%20multiple%20premium%20vehicles%20displayed%20on%20polished%20floor%20glass%20walls%20professional%20clean%20sophisticated&width=800&height=600&seq=about1&orientation=landscape"
                alt="Pacific Crowns Showroom"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-4 md:-right-8 bg-[#1a1a1a] text-white rounded-2xl p-5 w-48 md:w-56">
              <div className="text-[#d4af37] text-3xl font-black">15+</div>
              <div className="text-white/70 text-sm mt-1">
                Years Serving Premium Car Buyers
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight mb-6">
              Delivering Excellence in
              <br />
              <span className="text-[#d4af37]">Automotive Sales</span>
            </h2>
            <p className="text-[#6b6b6b] text-base leading-relaxed mb-5">
              Founded in 2010, Pacific Crowns has grown from a small
              family-owned dealership into one of the most trusted names in
              premium automobile sales on the West Coast. We believe that buying
              a car should be an experience as exceptional as the vehicle
              itself.
            </p>
            <p className="text-[#6b6b6b] text-base leading-relaxed mb-8">
              Our team of certified automotive specialists is dedicated to
              matching each client with their perfect vehicle — whether
              it&apos;s a sleek executive sedan, a powerful SUV, or a
              cutting-edge electric vehicle. Every car in our inventory is
              rigorously inspected and certified to meet our uncompromising
              standards.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#inventory"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("inventory")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap"
              >
                View Inventory
                <i className="ri-arrow-right-line"></i>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a1a1a]/20 text-[#1a1a1a] text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-[#f8f8f8]"
            >
              <div className="text-3xl md:text-4xl font-black text-[#1a1a1a] mb-2">
                {stat.value}
              </div>
              <div className="text-[#6b6b6b] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Brand Logos */}
        <div className="border-t border-gray-100 pt-12">
          <p className="text-center text-[#6b6b6b] text-xs font-semibold tracking-widest uppercase mb-8">
            Authorized Dealer &amp; Certified Partner
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-[#1a1a1a]/30 font-black text-lg md:text-xl tracking-wider hover:text-[#1a1a1a]/60 transition-colors cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
