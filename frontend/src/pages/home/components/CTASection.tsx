import { useAuth } from "@/context/useAuth";

export default function CTASection() {
  const { user, openSignup } = useAuth();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=luxury%20car%20dealership%20showroom%20interior%20night%20time%20dramatic%20lighting%20multiple%20premium%20vehicles%20displayed%20polished%20floor%20reflections%20elegant%20sophisticated%20atmosphere&width=1600&height=700&seq=cta1&orientation=landscape"
          alt="Pacific Crowns Showroom"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold tracking-widest uppercase rounded-full mb-6">
            Start Your Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Your Dream Car
            <br />
            <span className="text-[#d4af37]">Awaits You</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            Join thousands of satisfied clients who found their perfect vehicle
            at Pacific Crowns. Create your account today and unlock our full
            inventory, exclusive deals, and personalized service.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {!user ? (
              <>
                <button
                  onClick={openSignup}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#d4af37] text-[#1a1a1a] font-bold rounded-full hover:bg-[#c9a227] transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
                >
                  <i className="ri-user-add-line"></i>
                  Create Free Account
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/25 transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
                >
                  <i className="ri-eye-line"></i>
                  Explore Services
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  document
                    .getElementById("inventory")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#d4af37] text-[#1a1a1a] font-bold rounded-full hover:bg-[#c9a227] transition-all duration-200 cursor-pointer whitespace-nowrap text-sm"
              >
                <i className="ri-car-line"></i>
                Browse Full Inventory
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
