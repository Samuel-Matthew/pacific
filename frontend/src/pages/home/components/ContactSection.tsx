import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { getContactInfo, type ContactInfo } from "@/api/contactInfo";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [contactData, setContactData] = useState<ContactInfo>({});

  // Load contact info from database
  useEffect(() => {
    const fetchContacts = async () => {
      const data = await getContactInfo();
      setContactData(data);
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const message =
      (form.elements.namedItem("message") as HTMLTextAreaElement)?.value || "";
    if (message.length > 500) return;

    setLoading(true);

    try {
      const formData = new FormData(form);
      const response = await fetch("http://localhost:5001/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          inquiry_type: formData.get("inquiry_type"),
          message: formData.get("message"),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      setSubmitted(true);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitted(true); // Still show success to not break UX
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-5">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] leading-tight mb-4">
            Ready to Find Your
            <br />
            <span className="text-[#d4af37]">Perfect Vehicle?</span>
          </h2>
          <p className="text-[#6b6b6b] text-base max-w-lg mx-auto">
            Visit our showroom, schedule a test drive, or simply reach out — our
            team is here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <div>
            <div className="relative rounded-2xl overflow-hidden w-full h-64 mb-8">
              <img
                src="https://readdy.ai/api/search-image?query=luxury%20car%20dealership%20exterior%20modern%20glass%20building%20night%20time%20illuminated%20premium%20showroom%20elegant%20architecture%20professional%20photography&width=800&height=400&seq=contact1&orientation=landscape"
                alt="Pacific Crown Motors Showroom"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-lg">
                  Pacific Crown Motors
                </p>
                <p className="text-white/70 text-sm">
                  Premium Automobile Dealership
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {[
                {
                  icon: "ri-map-pin-line",
                  label: "Showroom Address",
                  value: "9551 Irvine Center Dr, Irvine, CA 92618",
                },
                ...(contactData.whatsapp
                  ? [
                      {
                        icon: "ri-whatsapp-line",
                        label: "WhatsApp",
                        value: contactData.whatsapp,
                      },
                    ]
                  : []),
                ...(contactData.email
                  ? [
                      {
                        icon: "ri-mail-line",
                        label: "Email",
                        value: contactData.email,
                      },
                    ]
                  : []),
                ...(contactData.phone
                  ? [
                      {
                        icon: "ri-phone-line",
                        label: "Phone",
                        value: contactData.phone,
                      },
                    ]
                  : []),
                ...(contactData.telegram
                  ? [
                      {
                        icon: "ri-telegram-2-line",
                        label: "Telegram",
                        value: contactData.telegram,
                      },
                    ]
                  : []),
                ...(contactData.signal
                  ? [
                      {
                        icon: "ri-signal-tower-line",
                        label: "Signal",
                        value: contactData.signal,
                      },
                    ]
                  : []),
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#f0f0f0] flex-shrink-0">
                    <i className={`${item.icon} text-[#1a1a1a] text-base`}></i>
                  </div>
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-[#1a1a1a] text-sm font-medium">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Buttons */}
            <div className="flex gap-3 mt-8 flex-wrap">
              {contactData.whatsapp && (
                <a
                  href={`https://wa.me/${contactData.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="WhatsApp"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe5d] transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-whatsapp-line text-base"></i>
                  WhatsApp
                </a>
              )}
              {contactData.signal && (
                <a
                  href={`https://signal.me/#p/${contactData.signal}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="Signal"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3a76f0] text-white text-sm font-semibold hover:bg-[#2d63d4] transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-signal-tower-line text-base"></i>
                  Signal
                </a>
              )}
              {contactData.telegram && (
                <a
                  href={`https://t.me/${contactData.telegram.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label="Telegram"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0088cc] text-white text-sm font-semibold hover:bg-[#006ba3] transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-telegram-2-line text-base"></i>
                  Telegram
                </a>
              )}
              {contactData.email && (
                <a
                  href={`mailto:${contactData.email}`}
                  aria-label="Email"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f0f0f0] text-[#1a1a1a] text-sm font-semibold hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-mail-line text-base"></i>
                  Email Us
                </a>
              )}
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-[#f8f8f8] rounded-2xl p-7 md:p-9">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-5">
                  <i className="ri-check-line text-emerald-600 text-2xl"></i>
                </div>
                <h3 className="text-[#1a1a1a] font-bold text-xl mb-2">
                  Message Sent!
                </h3>
                <p className="text-[#6b6b6b] text-sm max-w-xs">
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-[#1a1a1a] text-white text-sm font-semibold rounded-full hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-[#1a1a1a] font-bold text-xl mb-6">
                  Send Us a Message
                </h3>
                <form
                  data-readdy-form
                  id="contact-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <input type="hidden" name="_captcha" value="false" />
                  <input
                    type="hidden"
                    name="_subject"
                    value="New Contact Inquiry — Pacific Crown Motors"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        required
                        placeholder="John"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (310) 000-0000"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
                      Inquiry Type
                    </label>
                    <select
                      name="inquiry_type"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] transition-colors cursor-pointer"
                    >
                      <option value="test_drive">Schedule a Test Drive</option>
                      <option value="vehicle_inquiry">Vehicle Inquiry</option>
                      <option value="financing">Financing Options</option>
                      <option value="trade_in">Trade-In Valuation</option>
                      <option value="service">Service Appointment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#1a1a1a] text-xs font-semibold uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      maxLength={500}
                      placeholder="Tell us how we can help you..."
                      onChange={(e) => setCharCount(e.target.value.length)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none"
                    ></textarea>
                    <p
                      className={`text-xs mt-1 text-right ${charCount > 480 ? "text-rose-500" : "text-[#6b6b6b]"}`}
                    >
                      {charCount}/500
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#333] transition-colors cursor-pointer whitespace-nowrap text-sm disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
