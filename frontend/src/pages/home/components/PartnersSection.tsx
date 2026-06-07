import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { partners } from "@/mocks/partners";
import { createPartnershipApplication } from "@/api/partnerships";
import { useAuth } from "@/context/useAuth";
import { useToast } from "@/context/ToastContext";

const EFFECTIVE_DATE = "2001";
const HQ_ADDRESS = "9551 Irvine Center Dr, Irvine, CA 92618, California, USA";
const CONTACT_EMAIL = "pacificcrownautosinfo@gmail.com";
const WHATSAPP_NUMBER = "+1 (683) 205 6826";
const WHATSAPP_LINK = "https://wa.me/16832056826";
const SIGNAL_NUMBER = "+1 (307) 629 0128";
const SIGNAL_LINK = "https://signal.me/#p/+13076290128";

interface Partner {
  id: number;
  name: string;
  category: string;
  initial: string;
  image: string;
  netWorth: string;
  yearsOfPartnership: number;
  testimonial: string;
  title: string;
}

interface PartnerCardProps {
  partner: Partner;
  onClick: (partner: Partner) => void;
}

function PartnerCard({ partner, onClick }: PartnerCardProps) {
  const isPrivate = partner.category === "Private Investor";
  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => onClick(partner)}
    >
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-[#d4af37] group-hover:-translate-y-1 active:scale-95">
        {/* Partner Image */}
        <div className="relative w-full h-32 sm:h-36 md:h-44 overflow-hidden bg-[#f5f5f5]">
          <img
            src={partner.image}
            alt={partner.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-[10px] font-semibold">
              {partner.yearsOfPartnership} yrs
            </span>
          </div>
          {/* Category badge */}
          <div className="absolute top-2 right-2">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isPrivate ? "bg-[#d4af37] text-[#1a1a1a]" : "bg-[#1a1a1a] text-white"}`}
            >
              {isPrivate ? "Investor" : "Partner"}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 md:p-4">
          <p className="text-[#1a1a1a] font-bold text-xs md:text-sm leading-tight truncate">
            {partner.name}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <div>
              <p className="text-[#6b6b6b] text-[9px]">Net Worth</p>
              <p className="text-[#1a1a1a] font-black text-xs md:text-sm">
                {partner.netWorth}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#6b6b6b] text-[9px]">Yrs</p>
              <p className="text-[#1a1a1a] font-black text-xs md:text-sm">
                {partner.yearsOfPartnership}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnersSection() {
  const navigate = useNavigate();
  const { user, openLogin } = useAuth();
  const { addToast } = useToast();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tcExpanded, setTcExpanded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signed, setSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareAmount, setShareAmount] = useState(150000);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [applicationData, setApplicationData] = useState<{
    referenceId: string;
    applicationId: string;
    investmentAmount: number;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const idFileInputRef = useRef<HTMLInputElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (showAgreement || selectedPartner) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAgreement, selectedPartner]);

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPos.current) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
    setHasSignature(true);
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleAgree = async () => {
    if (!hasSignature) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Capture the signature as base64
      const canvas = canvasRef.current;
      const signatureData = canvas ? canvas.toDataURL("image/png") : "";

      // Collect form data
      const formElement = document.getElementById(
        "partnership-form",
      ) as HTMLFormElement;
      const form = new FormData(formElement);

      // Determine ID type from checkboxes
      let idType = "";
      if (form.has("id_drivers_license")) {
        idType = "drivers_license";
      } else if (form.has("id_green_card")) {
        idType = "green_card";
      } else if (form.has("id_passport")) {
        idType = "passport";
      }

      // Build application data matching the model schema
      const appData = {
        partnerInfo: {
          fullLegalName: form.get("full_legal_name") as string,
          email: form.get("email") as string,
          phoneNumber: form.get("phone_number") as string,
          homeAddress: form.get("home_address") as string,
          incomeSource: form.get("income_source") as string,
          annualIncome: form.get("annual_income") as string,
          idType: idType,
          agreementDate:
            (form.get("agreement_date") as string) ||
            new Date().toISOString().split("T")[0],
          printedName: form.get("printed_name") as string,
        },
        investmentAmount: shareAmount,
        signature: signatureData,
      };

      // Create partnership application via API with ID document
      if (!idFile) {
        addToast(
          "ID document is required to submit the application",
          "error",
          5000,
        );
        setIsSubmitting(false);
        return;
      }

      const appResult = await createPartnershipApplication(appData, idFile);
      const resultApplicationId = appResult.data.applicationId;
      const referenceId = appResult.data.referenceId;

      // Store application data and show confirmation modal
      setApplicationData({
        referenceId:
          referenceId ||
          `PCM-${new Date().toISOString().split("T")[0].replace(/-/g, "")}`,
        applicationId: resultApplicationId,
        investmentAmount: shareAmount,
      });

      // Show success toast
      addToast(
        "Partnership agreement submitted successfully!",
        "success",
        4000,
      );

      // Close agreement modal and show confirmation modal
      setShowAgreement(false);
      setShowConfirmation(true);
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Error creating partnership application:", error);
      setIsSubmitting(false);

      // Show error toast instead of alert
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit partnership application. Please try again.";
      addToast(errorMessage, "error", 5000);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const projectedReturn = shareAmount * 0.15 * 4;
  const totalValue = shareAmount + projectedReturn;

  return (
    <section id="partners" className="py-16 md:py-28 bg-[#f8f8f6] relative">
      {/* Partner Detail Modal — click-based, works on mobile & desktop */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close bar for mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={selectedPartner.image}
                alt={selectedPartner.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/30 to-transparent"></div>
              {/* Close button desktop */}
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer hidden sm:flex"
              >
                <i className="ri-close-line text-sm"></i>
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span
                  className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full mb-2 ${selectedPartner.category === "Private Investor" ? "bg-[#d4af37] text-[#1a1a1a]" : "bg-white text-[#1a1a1a]"}`}
                >
                  {selectedPartner.category}
                </span>
                <h3 className="text-white font-black text-xl sm:text-2xl">
                  {selectedPartner.name}
                </h3>
                <p className="text-white/70 text-xs mt-0.5">
                  {selectedPartner.title}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#f8f8f6] rounded-xl p-3 sm:p-4 text-center">
                  <p className="text-[#d4af37] font-black text-xl sm:text-2xl">
                    {selectedPartner.netWorth}
                  </p>
                  <p className="text-[#6b6b6b] text-[10px] mt-0.5">
                    Estimated Net Worth
                  </p>
                </div>
                <div className="bg-[#f8f8f6] rounded-xl p-3 sm:p-4 text-center">
                  <p className="text-[#1a1a1a] font-black text-xl sm:text-2xl">
                    {selectedPartner.yearsOfPartnership}
                  </p>
                  <p className="text-[#6b6b6b] text-[10px] mt-0.5">
                    Years of Partnership
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="relative mb-4">
                <i className="ri-double-quotes-l text-[#d4af37] text-3xl absolute -top-2 -left-1 opacity-40"></i>
                <p className="text-[#3a3a3a] text-sm leading-relaxed pl-5 italic">
                  {selectedPartner.testimonial}
                </p>
                <div className="flex items-center gap-1 mt-2 pl-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <i
                      key={s}
                      className="ri-star-fill text-[#d4af37] text-xs"
                    ></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 border border-[#1a1a1a]/20 text-[#1a1a1a] text-xs font-semibold tracking-widest uppercase rounded-full mb-4 md:mb-5">
            Our Network
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1a1a1a] leading-tight mb-3 md:mb-4">
            Trusted Partners &amp;
            <br />
            <span className="text-[#d4af37]">Industry Leaders</span>
          </h2>
          <p className="text-[#6b6b6b] text-sm md:text-base max-w-xl mx-auto">
            We collaborate with private investors and strategic partners across
            the country. Tap any card to learn more.
          </p>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#d4af37] inline-block"></span>
              <span className="text-[#6b6b6b] text-xs">Private Investor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1a1a1a] inline-block"></span>
              <span className="text-[#6b6b6b] text-xs">Partner</span>
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4 mb-10 md:mb-14">
          {partners.map((partner: (typeof partners)[number]) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onClick={setSelectedPartner}
            />
          ))}
        </div>

        {/* Become a Partner */}
        <div className="max-w-2xl mx-auto">
          {signed ? (
            <div className="text-center px-4">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-full">
                <i className="ri-checkbox-circle-fill text-emerald-500 text-base"></i>
                <span className="text-emerald-700 text-sm font-semibold text-center">
                  Partnership Agreement Signed! Our team will contact you within
                  48 hours.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => {
                  if (!user) {
                    openLogin();
                  } else {
                    setShowAgreement(true);
                  }
                }}
                className="w-full flex items-center justify-between px-4 sm:px-7 py-4 sm:py-5 hover:bg-[#fafafa] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-[#d4af37]/15 flex-shrink-0">
                    <i className="ri-links-line text-[#d4af37] text-lg sm:text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-[#1a1a1a] font-black text-sm sm:text-base tracking-wide uppercase">
                      Agreement to Become a Partner
                    </p>
                    <p className="text-[#6b6b6b] text-xs mt-0.5">
                      Click to review terms, sign, and join our network
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-[#d4af37] group-hover:bg-[#c9a227] transition-colors flex-shrink-0">
                  <i className="ri-arrow-right-line text-[#1a1a1a] text-sm sm:text-base"></i>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Agreement Modal ─── */}
      {showAgreement && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setShowAgreement(false);
              setTcExpanded(false);
            }}
          ></div>
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-7 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="text-[#1a1a1a] font-black text-base sm:text-lg tracking-wide uppercase">
                  Become a Partner
                </h3>
                <p className="text-[#6b6b6b] text-xs mt-0.5">
                  Pacific Crown Motors — Partnership Terms
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAgreement(false);
                  setTcExpanded(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer flex-shrink-0"
              >
                <i className="ri-close-line text-[#1a1a1a] text-sm"></i>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-5 sm:py-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
                <p className="text-amber-700 text-xs font-medium">
                  <i className="ri-information-line mr-1"></i>
                  This agreement can be edited by Pacific Crown Motors at any
                  time. Partners will be notified of changes via email.
                </p>
              </div>

              {/* Investment Amount Section */}
              <div className="bg-black rounded-2xl p-4 sm:p-6 mb-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-[#d4af37]/20 flex-shrink-0">
                    <i className="ri-coins-line text-[#d4af37] text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm uppercase tracking-wider">
                      Investment Amount
                    </h4>
                    <p className="text-white/60 text-xs">
                      Select your partnership stake
                    </p>
                  </div>
                </div>

                {/* Tier Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                  {[
                    { amount: 55000, label: "Starter Partner", popular: false },
                    { amount: 150000, label: "Premium Partner", popular: true },
                    { amount: 300000, label: "Elite Partner", popular: false },
                  ].map((tier) => (
                    <div
                      key={tier.amount}
                      className={`border rounded-xl p-2.5 sm:p-4 text-center relative cursor-pointer transition-all duration-200 ${shareAmount === tier.amount ? "bg-white/15 border-[#d4af37]" : tier.popular ? "bg-white/5 border-[#d4af37]/60 hover:bg-white/10" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                      onClick={() => setShareAmount(tier.amount)}
                    >
                      {tier.popular && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#d4af37] text-[#1a1a1a] text-[8px] sm:text-[9px] font-bold rounded-full whitespace-nowrap">
                          POPULAR
                        </div>
                      )}
                      <p className="text-[#d4af37] font-black text-sm sm:text-xl">
                        {tier.amount === 55000
                          ? "$55K"
                          : tier.amount === 150000
                            ? "$150K"
                            : "$300K"}
                      </p>
                      <p className="text-white/50 text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 hidden sm:block">
                        {tier.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Slider */}
                <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-white/70 text-xs">Custom Amount</span>
                    <span className="text-[#d4af37] font-black text-base sm:text-lg">
                      {formatCurrency(shareAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={shareAmount}
                    onChange={(e) => setShareAmount(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#d4af37]"
                  />
                  <div className="flex justify-between text-white/40 text-[10px] mt-1.5 sm:mt-2">
                    <span>$5K</span>
                    <span>$500K</span>
                  </div>
                </div>

                {/* Projected Returns */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-white/50 text-[9px] sm:text-[10px]">
                      Investment
                    </p>
                    <p className="text-white font-bold text-xs sm:text-sm">
                      {formatCurrency(shareAmount)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/50 text-[9px] sm:text-[10px]">
                      Annual (60%)
                    </p>
                    <p className="text-[#d4af37] font-bold text-xs sm:text-sm">
                      {formatCurrency(projectedReturn)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/50 text-[9px] sm:text-[10px]">
                      Total (1yr)
                    </p>
                    <p className="text-emerald-400 font-bold text-xs sm:text-sm">
                      {formatCurrency(totalValue)}
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                  <p className="text-white/60 text-[10px] uppercase tracking-widest mb-2 sm:mb-3">
                    Accepted Payment Methods
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {[
                      {
                        icon: "ri-bank-line",
                        label: "Wire Transfer",
                        sub: "International",
                      },
                      {
                        icon: "ri-checkbox-blank-line",
                        label: "Wire Check",
                        sub: "Domestic",
                      },
                      {
                        icon: "ri-exchange-dollar-line",
                        label: "ACH Payment",
                        sub: "Bank Transfer",
                      },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2"
                      >
                        <i
                          className={`${m.icon} text-[#d4af37] text-xs sm:text-sm flex-shrink-0`}
                        ></i>
                        <div className="min-w-0">
                          <p className="text-white text-[9px] sm:text-[10px] font-semibold truncate">
                            {m.label}
                          </p>
                          <p className="text-white/40 text-[8px] sm:text-[9px] hidden sm:block">
                            {m.sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/40 text-[9px] mt-2 text-center">
                    Payment details provided by your agent upon onboarding
                  </p>
                </div>
              </div>

              {/* Partnership Form */}
              <form
                id="partnership-form"
                className="bg-[#f8f8f6] border border-gray-200 rounded-xl p-4 sm:p-5 mb-6"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <h5 className="text-[#1a1a1a] font-black text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="ri-user-settings-line text-[#d4af37]"></i>
                  Partner Information
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      label: "Full Legal Name",
                      name: "full_legal_name",
                      type: "text",
                      placeholder: "John Doe",
                    },
                    {
                      label: "Primary Phone Number",
                      name: "phone_number",
                      type: "tel",
                      placeholder: "+1 (555) 000-0000",
                    },
                    {
                      label: "Email Address",
                      name: "email",
                      type: "email",
                      placeholder: "john@example.com",
                    },
                    {
                      label: "Current Home Address",
                      name: "home_address",
                      type: "text",
                      placeholder: "123 Main St, City, State, ZIP",
                    },
                    {
                      label: "Primary Source of Income",
                      name: "income_source",
                      type: "text",
                      placeholder: "Business, Employment, Investments...",
                    },
                    {
                      label: "Estimated Annual Income",
                      name: "annual_income",
                      type: "text",
                      placeholder: "$50,000 - $100,000",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-[#6b6b6b] text-xs font-medium mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        required
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* ID Verification */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-[#6b6b6b] text-xs font-medium mb-3">
                    ID Verification (Select One)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                    {[
                      { name: "id_drivers_license", label: "Driver's License" },
                      { name: "id_green_card", label: "Green Card" },
                      { name: "id_passport", label: "Valid Passport" },
                    ].map((id) => (
                      <label
                        key={id.name}
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors"
                      >
                        <input
                          type="checkbox"
                          name={id.name}
                          className="w-4 h-4 accent-[#d4af37] flex-shrink-0"
                        />
                        <span className="text-[#1a1a1a] text-xs">
                          {id.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* ID Upload */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-[#6b6b6b] text-xs font-medium mb-2">
                      <i className="ri-id-card-line text-blue-500 mr-2"></i>
                      Upload ID Document
                    </label>
                    <p className="text-[#6b6b6b] text-[11px] mb-3">
                      Upload a clear photo or scan of your ID (JPG, PNG, PDF,
                      max 5MB). Admin can preview it for verification.
                    </p>

                    {!idPreview ? (
                      <div>
                        <input
                          ref={idFileInputRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,image/jpeg,image/png,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const maxSize = 5 * 1024 * 1024; // 5MB
                              if (file.size > maxSize) {
                                alert("File size exceeds 5MB limit.");
                                return;
                              }
                              setIdFile(file);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setIdPreview(event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => idFileInputRef.current?.click()}
                          className="w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <i className="ri-upload-cloud-2-line"></i>
                          Choose ID Document
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {idFile?.type.startsWith("image") ? (
                          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white p-2">
                            <img
                              src={idPreview}
                              alt="ID Preview"
                              className="w-full h-auto max-h-48 object-contain"
                            />
                            <p className="text-[10px] text-[#6b6b6b] text-center mt-2">
                              Admin preview: {idFile.name}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-4 flex items-center gap-3 border border-gray-200">
                            <i className="ri-file-pdf-line text-red-500 text-2xl flex-shrink-0"></i>
                            <div className="flex-1">
                              <p className="text-[#1a1a1a] font-semibold text-xs">
                                {idFile?.name}
                              </p>
                              <p className="text-[#6b6b6b] text-[11px]">
                                {((idFile?.size || 0) / 1024).toFixed(2)} KB
                              </p>
                              <p className="text-[10px] text-blue-600 mt-1">
                                Ready for admin review
                              </p>
                            </div>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setIdFile(null);
                            setIdPreview(null);
                          }}
                          className="w-full px-4 py-2 border border-blue-300 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Remove Document
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date & Printed Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-[#6b6b6b] text-xs font-medium mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      name="agreement_date"
                      required
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6b6b6b] text-xs font-medium mb-1.5">
                      Printed Name
                    </label>
                    <input
                      type="text"
                      name="printed_name"
                      required
                      placeholder="Type your full name"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                </div>

                <input
                  type="hidden"
                  name="investment_amount"
                  value={shareAmount}
                />
              </form>

              {/* T&C Dropdown */}
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <button
                  onClick={() => setTcExpanded(!tcExpanded)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-4 bg-[#f8f8f8] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <i className="ri-file-text-line text-[#d4af37] text-lg flex-shrink-0"></i>
                    <span className="text-[#1a1a1a] font-bold text-sm text-left">
                      Terms &amp; Conditions — Full Agreement
                    </span>
                  </div>
                  <i
                    className={`ri-arrow-down-s-line text-[#6b6b6b] text-xl transition-transform duration-300 flex-shrink-0 ${tcExpanded ? "rotate-180" : ""}`}
                  ></i>
                </button>

                {tcExpanded && (
                  <div className="px-4 sm:px-5 py-5 border-t border-gray-100 bg-white space-y-5 text-[#3a3a3a] text-xs leading-relaxed">
                    <div className="text-center border-b border-gray-100 pb-4">
                      <h4 className="text-[#1a1a1a] font-black text-sm sm:text-base uppercase tracking-widest">
                        Pacific Crown Motors
                      </h4>
                      <p className="text-[#d4af37] font-bold text-xs uppercase tracking-wider mt-0.5">
                        Partnership Agreement &amp; Terms and Conditions
                      </p>
                      <div className="mt-3 space-y-0.5 text-[#6b6b6b]">
                        <p>
                          <strong className="text-[#1a1a1a]">
                            Effective Date:
                          </strong>{" "}
                          {EFFECTIVE_DATE}
                        </p>
                        <p>
                          <strong className="text-[#1a1a1a]">
                            Headquarters:
                          </strong>{" "}
                          {HQ_ADDRESS}
                        </p>
                        <p>
                          <strong className="text-[#1a1a1a]">Email:</strong>{" "}
                          {CONTACT_EMAIL} &nbsp;|&nbsp;{" "}
                          <strong className="text-[#1a1a1a]">WhatsApp:</strong>{" "}
                          {WHATSAPP_NUMBER}
                        </p>
                      </div>
                    </div>

                    <p>
                      Welcome to Pacific Crown Motors. We are a California-based
                      automotive enterprise specializing in the strategic
                      importation and retail distribution of high-performance
                      and high-demand vehicles. This document outlines the terms
                      of our partnership program, designed to offer transparent,
                      secure, and mutually beneficial returns.
                    </p>
                    <p>
                      As a registered California business, we operate in full
                      compliance with state and federal regulations, including
                      US Customs and Border Protection (CBP) and Department of
                      Transportation (DOT) standards for international vehicle
                      acquisition.
                    </p>

                    <div>
                      <h5 className="text-[#1a1a1a] font-black text-xs uppercase tracking-widest mb-2 border-l-2 border-[#d4af37] pl-3">
                        Section 2: The Business Model
                      </h5>
                      <ul className="space-y-2 ml-1">
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Registration &amp; Support:
                          </strong>{" "}
                          Upon creating your partner login, a dedicated agent
                          will contact you via your provided email for
                          personalized onboarding guidance.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Global Acquisition:
                          </strong>{" "}
                          Our team identifies and acquires premium vehicle
                          inventory from key Asian markets — specifically Japan,
                          China, and Taiwan.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Importation &amp; Compliance:
                          </strong>{" "}
                          Vehicles are shipped directly to California. We manage
                          all logistics, customs clearance, and compliance with
                          California emissions and safety standards.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Retail Services:
                          </strong>{" "}
                          Once cleared, inventory is processed through our
                          California retail channels for sale or lease to
                          domestic consumers.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Profit Generation:
                          </strong>{" "}
                          Revenue from retail sales funds the next import cycle
                          and provides partnership returns.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-[#1a1a1a] font-black text-xs uppercase tracking-widest mb-2 border-l-2 border-[#d4af37] pl-3">
                        Section 3: Returns and Disbursements
                      </h5>
                      <ul className="space-y-2 ml-1">
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Receiving Your Returns:
                          </strong>{" "}
                          Returns are paid directly to your designated account
                          via Direct Bank Deposit/ACH, Wire Transfer, or a
                          secure payment gateway.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Return Rate:
                          </strong>{" "}
                          Partners are entitled to a return of{" "}
                          <strong className="text-[#d4af37]">
                            15% per Quarter
                          </strong>
                          .
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Quarterly Disbursement:
                          </strong>{" "}
                          Returns are calculated and disbursed every three
                          months. Payments are issued on the 5th of the month
                          following the end of the quarter.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Capital Maturation:
                          </strong>{" "}
                          Initial capital is held for <strong>8 months</strong>{" "}
                          to cover the import-to-retail cycle. You may renew or
                          request full withdrawal with 30 days&apos; notice.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-[#1a1a1a] font-black text-xs uppercase tracking-widest mb-2 border-l-2 border-[#d4af37] pl-3">
                        Section 4: Legitimacy &amp; Compliance
                      </h5>
                      <ul className="space-y-2 ml-1">
                        <li>
                          <strong className="text-[#1a1a1a]">
                            California Jurisdiction:
                          </strong>{" "}
                          This agreement is governed by the laws of the State of
                          California.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Import Regulations:
                          </strong>{" "}
                          We assume full responsibility for legal importation
                          from Japan, China, and Taiwan.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Transparency:
                          </strong>{" "}
                          Partners receive quarterly performance reports
                          detailing imports, retail flips, and inventory status.
                        </li>
                        <li>
                          <strong className="text-[#1a1a1a]">
                            Agent Assistance:
                          </strong>{" "}
                          Our agents are available via email/WhatsApp to provide
                          ongoing support.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Signature Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 sm:px-5 py-4 bg-[#f8f8f8] border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <i className="ri-pen-nib-line text-[#d4af37] text-lg"></i>
                    <span className="text-[#1a1a1a] font-bold text-sm">
                      Your Digital Signature
                    </span>
                  </div>
                  <p className="text-[#6b6b6b] text-xs mt-1 ml-7">
                    Draw your signature below using your mouse or finger.
                  </p>
                </div>
                <div className="p-3 sm:p-5 bg-white">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-[#fafafa]">
                    <canvas
                      ref={canvasRef}
                      width={560}
                      height={150}
                      className="w-full touch-none cursor-crosshair sm:h-[150px] h-[150px]"
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={stopDraw}
                      onMouseLeave={stopDraw}
                      onTouchStart={startDraw}
                      onTouchMove={draw}
                      onTouchEnd={stopDraw}
                    />
                  </div>
                  {!hasSignature ? (
                    <p className="text-[#6b6b6b] text-xs mt-2 text-center">
                      Sign above to enable the agreement button
                    </p>
                  ) : (
                    <button
                      onClick={clearSignature}
                      className="text-[#6b6b6b] text-xs mt-2 hover:text-rose-500 transition-colors cursor-pointer underline"
                    >
                      Clear Signature
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-4 sm:px-7 py-4 sm:py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => {
                  setShowAgreement(false);
                  setTcExpanded(false);
                }}
                className="px-4 sm:px-6 py-2.5 border border-gray-200 text-[#6b6b6b] text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  if (!hasSignature || isSubmitting) return;
                  handleAgree();
                }}
                disabled={!hasSignature || isSubmitting}
                className="px-4 sm:px-6 py-2.5 bg-[#d4af37] text-[#1a1a1a] text-sm font-bold rounded-full hover:bg-[#c9a227] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  "I Agree & Sign"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Confirmation Modal (After Application Submitted) ─── */}
      {showConfirmation && applicationData && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowConfirmation(false)}
          ></div>
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[95vh] sm:max-h-auto flex flex-col overflow-hidden">
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-8 sm:py-10 flex flex-col items-center text-center">
              {/* Success Checkmark Animation */}
              <div className="mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center bg-emerald-50 rounded-full animate-[scaleIn_0.4s_ease]">
                  <i className="ri-checkbox-circle-fill text-emerald-500 text-6xl sm:text-7xl"></i>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-[#1a1a1a] font-black text-2xl sm:text-3xl mb-2">
                Application Submitted
              </h2>
              <p className="text-[#6b6b6b] text-sm mb-6 sm:mb-8">
                Your partnership application has been received and is awaiting
                approval.
              </p>

              {/* Reference ID Card */}
              <div className="w-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl p-4 sm:p-5 mb-5 sm:mb-6">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1.5">
                  Application Reference ID
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[#d4af37] font-black text-base sm:text-lg break-all">
                    {applicationData.referenceId}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        applicationData.referenceId,
                      );
                      addToast(
                        "Reference ID copied to clipboard",
                        "success",
                        2000,
                      );
                    }}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <i className="ri-file-copy-line text-white text-sm"></i>
                  </button>
                </div>
              </div>

              {/* Investment Amount */}
              <div className="w-full bg-[#f8f8f6] border border-gray-200 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium mb-1.5">
                      Investment Amount
                    </p>
                    <p className="text-[#d4af37] font-black text-lg sm:text-xl">
                      {formatCurrency(applicationData.investmentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium mb-1.5">
                      Status
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      <p className="text-[#1a1a1a] font-bold text-xs uppercase">
                        Pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-8 sm:mb-10 text-left">
                <div className="flex items-start gap-3 mb-3">
                  <i className="ri-lightbulb-line text-blue-600 text-lg flex-shrink-0 mt-0.5"></i>
                  <div>
                    <p className="text-blue-900 font-bold text-sm mb-2">
                      What happens next?
                    </p>
                    <ul className="text-blue-800 text-xs space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">•</span>
                        <span>
                          Our team will review your application within 24-48
                          hours
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">•</span>
                        <span>
                          You'll receive an email notification with the decision
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">•</span>
                        <span>
                          Once approved, you can access your dashboard to
                          complete payment
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-0.5">•</span>
                        <span>Save your reference ID for future inquiries</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Help */}
              <div className="w-full bg-[#f8f8f6] border border-gray-200 rounded-xl p-4 sm:p-5 mb-6 sm:mb-8 text-left">
                <p className="text-[#6b6b6b] text-xs font-medium mb-3">
                  Questions? Get in touch
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-[#d4af37] transition-colors cursor-pointer text-[#1a1a1a] text-xs font-medium"
                  >
                    <i className="ri-whatsapp-line text-green-500"></i>
                    WhatsApp: {WHATSAPP_NUMBER}
                  </a>
                  <a
                    href={SIGNAL_LINK}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-[#d4af37] transition-colors cursor-pointer text-[#1a1a1a] text-xs font-medium"
                  >
                    <i className="ri-signal-tower-line text-[#3a76f0]"></i>
                    Signal: {SIGNAL_NUMBER}
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-7 py-4 sm:py-5 border-t border-gray-100 flex-shrink-0 bg-white">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-[#6b6b6b] text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSigned(true);
                  navigate("/partnerships/dashboard");
                }}
                className="flex-1 px-4 py-2.5 bg-[#d4af37] text-[#1a1a1a] text-sm font-bold rounded-full hover:bg-[#c9a227] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              >
                <i className="ri-arrow-right-line"></i>
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Contact Modal ─── */}
      {/* Contact Modal - REMOVED: Now redirects to /partnerships/apply */}
    </section>
  );
}
