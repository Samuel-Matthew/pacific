import { useAuth } from "@/context/useAuth";

const featured = [
  {
    image:
      "https://readdy.ai/api/search-image?query=2024%20Bentley%20Continental%20GT%20luxury%20coupe%20silver%20metallic%20parked%20on%20scenic%20coastal%20road%20dramatic%20sky%20cinematic%20automotive%20photography%20professional&width=800&height=500&seq=feat1&orientation=landscape",
    badge: "Exclusive",
    name: "2024 Bentley Continental GT",
    price: "$248,000",
    desc: "Hand-crafted British luxury. 626 hp W12 engine. Only 1 available.",
    specs: ["626 hp", "3.6s 0-60", "207 mph top speed"],
  },
  {
    image:
      "https://readdy.ai/api/search-image?query=2024%20Lamborghini%20Urus%20Pearl%20Capsule%20white%20SUV%20parked%20modern%20architecture%20dramatic%20lighting%20cinematic%20automotive%20photography%20professional%20luxury&width=800&height=500&seq=feat2&orientation=landscape",
    badge: "Limited",
    name: "2024 Lamborghini Urus",
    price: "$232,000",
    desc: "The world&apos;s most powerful super SUV. Raging bull meets everyday usability.",
    specs: ["657 hp", "3.5s 0-60", "190 mph top speed"],
  },
];

export default function FeaturedSection() {
  const { user, openLogin } = useAuth();

  return (
    <section className="py-20 md:py-28 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
              Spotlight
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight">
              Featured
              <br />
              <span className="text-[#d4af37]">Masterpieces</span>
            </h2>
          </div>
          <p className="text-[#6b6b6b] text-sm max-w-xs">
            Rare, exclusive vehicles that represent the pinnacle of automotive
            engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map((car) => (
            <div
              key={car.name}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
            >
              <div className="w-full h-72 md:h-80">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#d4af37] text-[#1a1a1a] text-xs font-bold rounded-full whitespace-nowrap">
                  {car.badge}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/60 text-xs mb-1">{car.desc}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-white font-black text-xl">
                      {car.name}
                    </h3>
                    <div className="flex gap-3 mt-2">
                      {car.specs.map((s) => (
                        <span key={s} className="text-white/60 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#d4af37] font-black text-xl">
                      {car.price}
                    </p>
                    <button
                      onClick={() => {
                        if (user) {
                          document
                            .getElementById("contact")
                            ?.scrollIntoView({ behavior: "smooth" });
                        } else {
                          openLogin();
                        }
                      }}
                      className="mt-2 px-4 py-2 bg-white text-[#1a1a1a] text-xs font-bold rounded-full hover:bg-[#d4af37] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Inquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
