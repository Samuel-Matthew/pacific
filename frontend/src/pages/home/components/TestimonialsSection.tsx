import { useState } from "react";
import { testimonials } from "@/mocks/testimonials";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight">
            What Our Clients
            <br />
            <span className="text-[#d4af37]">Are Saying</span>
          </h2>
        </div>

        {/* Main Testimonial Card */}
        <div className="bg-[#0d0d0d] rounded-3xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left - Portrait */}
            <div className="lg:w-2/5 relative">
              <div className="w-full h-64 lg:h-full min-h-[320px]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]/60 hidden lg:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent lg:hidden"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-between">
              {/* Stars */}
              <div>
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <i
                      key={i}
                      className="ri-star-fill text-[#d4af37] text-lg"
                    ></i>
                  ))}
                </div>

                {/* Quote */}
                <div className="text-[#d4af37] text-6xl font-black leading-none mb-4 opacity-60">
                  &ldquo;
                </div>
                <p className="text-white text-lg md:text-xl leading-relaxed mb-8">
                  {t.text}
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <p className="text-white font-bold text-base">{t.name}</p>
                    <p className="text-white/50 text-sm">
                      {t.role} &bull; {t.location}
                    </p>
                    <p className="text-[#d4af37] text-xs mt-1 font-medium">
                      {t.vehicle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={prev}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-left-s-line text-lg"></i>
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <i className="ri-arrow-right-s-line text-lg"></i>
                  </button>
                </div>
                <div className="flex gap-2">
                  {testimonials.map(
                    (_: (typeof testimonials)[number], i: number) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          i === current
                            ? "w-6 h-2 bg-[#d4af37]"
                            : "w-2 h-2 bg-white/30"
                        }`}
                      />
                    ),
                  )}
                </div>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 bg-[#d4af37] text-[#1a1a1a] text-sm font-bold rounded-full hover:bg-[#c9a227] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Share Your Story
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {testimonials.map(
            (item: (typeof testimonials)[number], i: number) => (
              <button
                key={item.id}
                onClick={() => setCurrent(i)}
                className={`text-left p-5 rounded-2xl transition-all duration-200 cursor-pointer ${
                  i === current
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-white text-[#1a1a1a] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover object-top"
                  />
                  <div>
                    <p
                      className={`font-semibold text-sm ${i === current ? "text-white" : "text-[#1a1a1a]"}`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`text-xs ${i === current ? "text-white/50" : "text-[#6b6b6b]"}`}
                    >
                      {item.vehicle}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-xs leading-relaxed line-clamp-2 ${i === current ? "text-white/70" : "text-[#6b6b6b]"}`}
                >
                  {item.text}
                </p>
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
