import { useState, useEffect } from "react";
import { getContactInfo, updateContactInfo } from "@/api/contactInfo";
import { useToast } from "@/context/ToastContext";

export default function ContactInfoTab() {
  const { addToast } = useToast();
  const [contactInfo, setContactInfo] = useState({
    email: "",
    whatsapp: "",
    telegram: "",
    signal: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setLoading(true);
    try {
      const data = await getContactInfo();
      setContactInfo({
        email: data.email || "",
        whatsapp: data.whatsapp || "",
        telegram: data.telegram || "",
        signal: data.signal || "",
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Failed to load contact info:", error);
      addToast("Failed to load contact information", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContactInfo(contactInfo);
      addToast("Contact information updated successfully", "success");
    } catch (error: any) {
      addToast(error.message || "Failed to update contact info", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <i className="ri-loader-4-line text-3xl text-[#d4af37]"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-6 text-white">
        <h3 className="text-xl font-black uppercase tracking-wide mb-2">
          Contact Information
        </h3>
        <p className="text-white/70 text-sm">
          Manage contact details displayed on the website
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
        <div>
          <label className="block text-[#1a1a1a] text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="contact@example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#1a1a1a] text-sm font-semibold mb-2">
            WhatsApp
          </label>
          <input
            type="tel"
            value={contactInfo.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            placeholder="+1 (683) 205 6826"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#1a1a1a] text-sm font-semibold mb-2">
            Telegram
          </label>
          <input
            type="tel"
            value={contactInfo.telegram}
            onChange={(e) => handleChange("telegram", e.target.value)}
            placeholder="+1 (307) 629 0128"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#1a1a1a] text-sm font-semibold mb-2">
            Signal
          </label>
          <input
            type="tel"
            value={contactInfo.signal}
            onChange={(e) => handleChange("signal", e.target.value)}
            placeholder="+1 (307) 629 0128"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#1a1a1a] text-sm font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (683) 205 6826"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#1a1a1a] placeholder-gray-400 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-700 text-xs">
            <i className="ri-information-line mr-2"></i>
            Leave a field empty to hide it from the contact page. Only populated
            fields will be displayed.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3 bg-[#d4af37] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#c9a227] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving && <i className="ri-loader-4-line animate-spin"></i>}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
