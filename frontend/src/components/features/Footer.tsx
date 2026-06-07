import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { getContactInfo } from "@/api/contactInfo";
import type { ContactInfo } from "@/api/contactInfo";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Inventory", href: "#inventory" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const services = [
  "New Vehicle Sales",
  "Certified Pre-Owned",
  "Flexible Financing",
  "Service & Maintenance",
  "Trade-In Program",
  "Concierge Service",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [contactLoading, setContactLoading] = useState(true);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error("Failed to load contact info:", error);
      } finally {
        setContactLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setSubscribed(true);
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0f1a0f] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Col 1 - Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src="https://public.readdy.ai/ai/img_res/70154d1f-be8f-47cc-a064-4284bd76349f.png"
              alt="Pacific Crowns Logo"
              className="h-20 w-auto object-contain mb-5"
            />
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Pacific Crowns is your premier destination for luxury and premium
              automobiles on the West Coast. We deliver excellence in every
              vehicle and every interaction.
            </p>
            <div className="flex gap-2">
              {!contactLoading && contactInfo?.signal && (
                <a
                  href={contactInfo.signal}
                  aria-label="Signal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 text-white/60 hover:bg-[#d4af37] hover:text-[#1a1a1a] transition-all duration-200 cursor-pointer"
                >
                  <i className="ri-signal-tower-line text-sm"></i>
                </a>
              )}
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div>
            <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-5">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/60 text-sm hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Services */}
          <div>
            <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-5">
              Our Services
            </p>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo("#services")}
                    className="text-white/60 text-sm hover:text-[#d4af37] transition-colors cursor-pointer whitespace-nowrap text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Newsletter */}
          <div>
            <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-5">
              Stay Updated
            </p>
            <p className="text-white/50 text-sm mb-5 leading-relaxed">
              Subscribe to receive the latest arrivals, exclusive deals, and
              automotive news.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <i className="ri-checkbox-circle-line text-base"></i>
                <span>You&apos;re subscribed!</span>
              </div>
            ) : (
              <form
                // data-readdy-form
                id="newsletter-form"
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3"
              >
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#d4af37] text-[#1a1a1a] text-sm font-bold rounded-xl hover:bg-[#c9a227] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            )}
            <p className="text-white/30 text-xs mt-3">
              By subscribing, you agree to our{" "}
              <a
                href="#"
                className="underline hover:text-white/50 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* Contact Info */}
            <div className="mt-8 flex flex-col gap-2">
              {!contactLoading && contactInfo?.whatsapp && (
                <a
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer"
                >
                  <i className="ri-whatsapp-line text-[#d4af37] text-sm"></i>
                  {contactInfo.phone || "Contact us"}
                </a>
              )}
              {!contactLoading && contactInfo?.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer"
                >
                  <i className="ri-mail-line text-[#d4af37] text-sm"></i>
                  {contactInfo.email}
                </a>
              )}
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <i className="ri-map-pin-line text-[#d4af37] text-sm"></i>
                9551 Irvine Center Dr, Irvine, CA 92618
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Typography Bar */}
      <div className="border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <p className="text-[#e8dcc4]/10 font-black text-5xl md:text-8xl lg:text-9xl tracking-tight text-center select-none whitespace-nowrap overflow-hidden">
            PACIFIC CROWNS
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            &copy; 2026 Pacific Crowns Automobiles. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-white/30 text-xs hover:text-white/60 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
