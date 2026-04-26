import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    image:
      "https://readdy.ai/api/search-image?query=luxury%20BMW%207%20series%20white%20sedan%20parked%20on%20modern%20city%20street%20at%20golden%20hour%20dramatic%20lighting%20cinematic%20automotive%20photography%20dark%20moody%20background%20professional&width=1600&height=900&seq=hero1&orientation=landscape",
    title: "Drive the",
    titleAccent: "Extraordinary",
    subtitle:
      "Premium vehicles curated for those who demand the very best in performance, luxury, and style.",
    vehicle: "2024 BMW 7 Series",
    price: "From $89,900",
  },
  {
    image:
      "https://readdy.ai/api/search-image?query=black%20Mercedes%20GLE%20SUV%20parked%20on%20mountain%20road%20dramatic%20sunset%20sky%20cinematic%20automotive%20photography%20dark%20moody%20professional%20luxury&width=1600&height=900&seq=hero2&orientation=landscape",
    title: "Elevate Your",
    titleAccent: "Journey",
    subtitle:
      "Discover our handpicked collection of certified pre-owned and brand new luxury automobiles.",
    vehicle: "2023 Mercedes GLE 450",
    price: "From $74,500",
  },
  {
    image:
      "https://readdy.ai/api/search-image?query=white%20Porsche%20Cayenne%20sports%20SUV%20on%20coastal%20highway%20dramatic%20ocean%20background%20cinematic%20automotive%20photography%20professional%20luxury%20moody&width=1600&height=900&seq=hero3&orientation=landscape",
    title: "Experience",
    titleAccent: "Perfection",
    subtitle:
      "Pacific Crowns — where every vehicle tells a story of craftsmanship, power, and prestige.",
    vehicle: "2024 Porsche Cayenne",
    price: "From $96,200",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goNext = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const goPrev = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      setAnimating(false);
    }, 400);
  }, [animating]);

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative w-full h-[100svh] min-h-[600px] overflow-hidden"
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={slide.image}
          alt={slide.vehicle}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
      </div>

      {/* Top Badges */}
      {/* <div className="absolute top-24 md:top-28 left-4 md:left-12 flex flex-wrap gap-2 z-10">
        {["New Arrivals", "Certified Pre-Owned", "Financing Available"].map(
          (tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20 whitespace-nowrap"
            >
              {tag}
            </span>
          ),
        )}
      </div> */}

      {/* Main Content */}
      <div
        className={`absolute inset-0 flex flex-col justify-center px-4 md:px-12 lg:px-20 transition-all duration-500 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-[#d4af37] text-sm font-semibold tracking-widest uppercase mb-3">
            Pacific Crowns Automobiles
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-2">
            {slide.title}
          </h1>
          <h1
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
            style={{ color: "#d4af37" }}
          >
            {slide.titleAccent}
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-lg leading-relaxed mb-8">
            {slide.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#inventory"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("inventory")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#d4af37] text-[#1a1a1a] font-bold rounded-full hover:bg-[#c9a227] transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
            >
              <i className="ri-car-line"></i>
              Browse Inventory
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/25 transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
            >
              <i className="ri-phone-line"></i>
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Featured Vehicle Card */}
      <div
        className={`absolute bottom-8 right-4 md:right-12 z-10 transition-all duration-500 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 w-64 md:w-72">
          <span className="text-[#d4af37] text-xs font-semibold tracking-wider uppercase">
            Featured Vehicle
          </span>
          <p className="text-white font-bold text-lg mt-1">{slide.vehicle}</p>
          <p className="text-white/60 text-sm mt-0.5">{slide.price}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span className="text-white/70 text-xs">Available Now</span>
          </div>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-8 left-4 md:left-12 flex items-center gap-4 z-10">
        <button
          onClick={goPrev}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-colors cursor-pointer"
        >
          <i className="ri-arrow-left-s-line text-lg"></i>
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setAnimating(true);
                setTimeout(() => {
                  setCurrent(i);
                  setAnimating(false);
                }, 400);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === current ? "w-6 h-2 bg-[#d4af37]" : "w-2 h-2 bg-white/40"
              }`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-colors cursor-pointer"
        >
          <i className="ri-arrow-right-s-line text-lg"></i>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 hidden md:flex">
        <span className="text-white/40 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"></div>
      </div>
    </section>
  );
}
