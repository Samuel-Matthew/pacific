import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserApplication,
  requestPaymentMethod,
  uploadPaymentProof,
  updateAccountDetails,
} from "@/api/partnerships";
import { getContactInfo } from "@/api/contactInfo";
import type { ContactInfo } from "@/api/contactInfo";
import { useAuth } from "@/context/useAuth";
import SuccessModal from "@/components/common/SuccessModal";
import ErrorModal from "@/components/common/ErrorModal";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {} = useAuth();

  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "wire_transfer" | "wire_check" | "ach_payment" | ""
  >("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking",
    swiftCode: "",
    mailingAddress: "",
  });
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [showBankEditForm, setShowBankEditForm] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getUserApplication();
        setApplication(response.data);
      } catch (error: any) {
        console.error("Error fetching application:", error);
        setErrorMessage(
          error.message || "No partnership application found. Start a new one!",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, []);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error("Failed to load contact info:", error);
      }
    };

    loadContactInfo();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "approved":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "ri-time-line";
      case "approved":
        return "ri-checkbox-circle-fill";
      case "rejected":
        return "ri-close-circle-fill";
      default:
        return "ri-question-line";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "awaiting":
        return "bg-gray-50 border-gray-200 text-gray-700";
      case "payment_requested":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "received":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "awaiting":
        return "ri-bank-line";
      case "payment_requested":
        return "ri-mail-send-line";
      case "received":
        return "ri-check-double-line";
      default:
        return "ri-question-line";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleRequestPaymentMethod = async () => {
    if (!selectedMethod || !application) return;

    try {
      setIsSubmitting(true);
      await requestPaymentMethod(application._id, selectedMethod);
      setApplication({
        ...application,
        paymentTracking: {
          ...application.paymentTracking,
          status: "payment_requested",
          requestedPaymentMethod: selectedMethod,
        },
      });
      setShowMethodSelector(false);
      setSelectedMethod("");
    } catch (error) {
      console.error("Error requesting payment method:", error);
      setErrorModal({
        isOpen: true,
        title: "Request Failed",
        message: "Failed to request payment method. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodLabel = (method: string): string => {
    switch (method) {
      case "wire_transfer":
        return "Wire Transfer (International)";
      case "wire_check":
        return "Wire Check (Domestic)";
      case "ach_payment":
        return "ACH Payment (Bank Transfer)";
      default:
        return "";
    }
  };

  const PartnerFinalDashboard = () => {
    const partnerInfo = application.partnerInfo || {};

    return (
      <div
        className="space-y-12 md:space-y-16 fade-in-up"
        style={{ animationDelay: "0.4s" }}
      >
        {/* Reference & Status Summary */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#f8f8f6] rounded-lg p-4 flex items-start justify-between">
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  Reference ID
                </p>
                <p className="text-[#1a1a1a] font-black text-lg">
                  {application.referenceId}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(application.referenceId)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy Reference ID"
              >
                <i className="ri-file-copy-line text-[#d4af37] text-lg"></i>
              </button>
            </div>
            <div className="bg-[#f8f8f6] rounded-lg p-4">
              <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                Application Date
              </p>
              <p className="text-[#1a1a1a] font-black text-lg">
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-[#f8f8f6] rounded-lg p-4">
              <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                Partner Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <i className="ri-checkbox-circle-fill text-emerald-600 text-lg"></i>
                <p className="text-[#1a1a1a] font-black text-lg">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Summary - Investment Metrics */}
        <div className="bg-gradient-to-br from-[#d4af37] to-[#c9a227] rounded-2xl p-8 md:p-12 text-[#1a1a1a]">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-black mb-2">
              Partner Investment Summary
            </h3>
            <p className="text-[#1a1a1a]/70 text-base">
              Your complete investment overview and returns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50 hover:border-white transition-colors">
              <p className="text-[#1a1a1a]/60 text-xs font-semibold uppercase tracking-wider mb-3">
                Investment Amount
              </p>
              <p className="text-3xl md:text-4xl font-black text-[#1a1a1a]">
                {formatCurrency(application.investmentAmount)}
              </p>
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50 hover:border-white transition-colors">
              <p className="text-[#1a1a1a]/60 text-xs font-semibold uppercase tracking-wider mb-3">
                Annual Return (60%)
              </p>
              <p className="text-3xl md:text-4xl font-black text-emerald-600">
                {formatCurrency(application.projectedAnnualReturn)}
              </p>
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50 hover:border-white transition-colors">
              <p className="text-[#1a1a1a]/60 text-xs font-semibold uppercase tracking-wider mb-3">
                Total After Year 1
              </p>
              <p className="text-3xl md:text-4xl font-black text-[#1a1a1a]">
                {formatCurrency(application.totalValueAfterYear)}
              </p>
            </div>
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50 hover:border-white transition-colors">
              <p className="text-[#1a1a1a]/60 text-xs font-semibold uppercase tracking-wider mb-3">
                Payment Status
              </p>
              <div className="text-center">
                <div className="inline-block mt-1">
                  <div
                    className={`border rounded-lg px-3 py-2 ${getPaymentStatusColor(application.paymentTracking.status)}`}
                  >
                    <div className="flex items-center gap-2">
                      <i
                        className={`${getPaymentStatusIcon(application.paymentTracking.status)} text-base`}
                      ></i>
                      <span className="font-semibold capitalize text-xs">
                        {application.paymentTracking.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Information Cards - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Partner Profile Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h4 className="text-xl font-black text-[#1a1a1a] flex items-center gap-2">
                <i className="ri-user-line text-[#d4af37]"></i>
                Partner Profile
              </h4>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  Full Legal Name
                </p>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {partnerInfo.fullLegalName || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  Email Address
                </p>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {partnerInfo.email || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  Phone Number
                </p>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {partnerInfo.phoneNumber || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  ID Type
                </p>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {partnerInfo.idType
                    ? partnerInfo.idType
                        .replace(/_/g, " ")
                        .charAt(0)
                        .toUpperCase() +
                      partnerInfo.idType.replace(/_/g, " ").slice(1)
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Income Information Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h4 className="text-xl font-black text-[#1a1a1a] flex items-center gap-2">
                <i className="ri-money-dollar-circle-line text-[#d4af37]"></i>
                Financial Info
              </h4>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  Annual Income
                </p>
                <p className="text-[#1a1a1a] font-black text-lg">
                  {partnerInfo.annualIncome
                    ? `$${parseInt(partnerInfo.annualIncome.replace(/\\D/g, "")).toLocaleString()}+`
                    : "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  Income Source
                </p>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {partnerInfo.incomeSource || "Not provided"}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-blue-700 text-xs">
                    ✓ Income verified and on file
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h4 className="text-xl font-black text-[#1a1a1a] flex items-center gap-2">
                <i className="ri-bank-line text-[#d4af37]"></i>
                Payment Status
              </h4>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                  Current Status
                </p>
                <div
                  className={`border rounded-lg px-3 py-2 ${getPaymentStatusColor(application.paymentTracking.status)}`}
                >
                  <div className="flex items-center gap-2">
                    <i
                      className={`${getPaymentStatusIcon(application.paymentTracking.status)} text-base`}
                    ></i>
                    <span className="font-semibold capitalize text-sm">
                      {application.paymentTracking.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                  Payment Method
                </p>
                <p className="text-[#1a1a1a] font-semibold text-sm">
                  {application.paymentTracking.requestedPaymentMethod
                    ? getPaymentMethodLabel(
                        application.paymentTracking.requestedPaymentMethod,
                      )
                    : "Pending selection"}
                </p>
              </div>
              {application.paymentTracking.paymentReceivedDate && (
                <div>
                  <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-1">
                    Payment Received
                  </p>
                  <p className="text-emerald-600 font-black text-sm">
                    {new Date(
                      application.paymentTracking.paymentReceivedDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details Summary Card */}
        {application.bankDetails?.accountHolderName && (
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200">
            <div className="mb-8 pb-8 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-black text-[#1a1a1a] flex items-center gap-2 mb-2">
                  <i className="ri-bank-card-line text-[#d4af37]"></i>
                  Bank Account Details
                </h4>
                <p className="text-[#6b6b6b] text-sm">
                  Your verified banking information for returns distribution
                </p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                <i className="ri-shield-check-line text-emerald-600 text-lg"></i>
                <span className="text-emerald-700 font-semibold text-sm">
                  Verified
                </span>
              </div>
            </div>

            {!showBankEditForm ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                      Account Holder Name
                    </p>
                    <p className="text-[#1a1a1a] font-black text-lg">
                      {application.bankDetails.accountHolderName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                      Bank Name
                    </p>
                    <p className="text-[#1a1a1a] font-black text-lg">
                      {application.bankDetails.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                      Account Number
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-[#1a1a1a] font-black text-lg font-mono">
                        {maskAccountNumber(
                          application.bankDetails.accountNumber,
                        )}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(application.bankDetails.accountNumber)
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy Account Number"
                      >
                        <i className="ri-file-copy-line text-[#d4af37] text-base"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                      Account Type
                    </p>
                    <p className="text-[#1a1a1a] font-black text-lg capitalize">
                      {application.bankDetails.accountType}
                    </p>
                  </div>
                  {application.bankDetails.routingNumber && (
                    <div>
                      <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                        Routing Number
                      </p>
                      <p className="text-[#1a1a1a] font-black text-lg font-mono">
                        {maskRoutingNumber(
                          application.bankDetails.routingNumber,
                        )}
                      </p>
                    </div>
                  )}
                  {application.bankDetails.swiftCode && (
                    <div>
                      <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                        SWIFT Code
                      </p>
                      <p className="text-[#1a1a1a] font-black text-lg">
                        {application.bankDetails.swiftCode}
                      </p>
                    </div>
                  )}
                </div>

                {application.bankDetails.mailingAddress && (
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-[#6b6b6b] text-xs font-medium uppercase tracking-wide mb-2">
                      Mailing Address
                    </p>
                    <p className="text-[#1a1a1a] font-semibold text-sm whitespace-pre-wrap">
                      {application.bankDetails.mailingAddress}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowBankEditForm(true)}
                  className="w-full mt-6 px-6 py-3 bg-white border-2 border-[#d4af37] text-[#d4af37] font-semibold rounded-full hover:bg-[#f8f8f6] transition-colors flex items-center justify-center gap-2"
                >
                  <i className="ri-edit-line"></i>
                  Edit Bank Details
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountHolderName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountHolderName: e.target.value,
                      })
                    }
                    placeholder="Full name as it appears on your account"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                  />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        bankName: e.target.value,
                      })
                    }
                    placeholder="e.g., Chase Bank, Bank of America"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                  />
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                    Account Type
                  </label>
                  <select
                    value={bankDetails.accountType}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="money_market">Money Market</option>
                  </select>
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Your account number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                  />
                </div>

                {/* Routing Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                    Routing Number (US)
                  </label>
                  <input
                    type="text"
                    value={bankDetails.routingNumber}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        routingNumber: e.target.value,
                      })
                    }
                    placeholder="9-digit routing number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                  />
                </div>

                {/* SWIFT Code */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                    SWIFT Code (International)
                  </label>
                  <input
                    type="text"
                    value={bankDetails.swiftCode}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        swiftCode: e.target.value,
                      })
                    }
                    placeholder="SWIFT/BIC code for international transfers"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                  />
                </div>

                {/* Mailing Address */}
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                    Mailing Address *
                  </label>
                  <textarea
                    value={bankDetails.mailingAddress}
                    onChange={(e) =>
                      setBankDetails({
                        ...bankDetails,
                        mailingAddress: e.target.value,
                      })
                    }
                    placeholder="Your complete mailing address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowBankEditForm(false)}
                    className="flex-1 px-6 py-2 border border-gray-300 text-[#6b6b6b] font-semibold rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBankDetails}
                    disabled={isSavingDetails}
                    className="flex-1 px-6 py-2 bg-[#d4af37] hover:bg-[#c9a227] disabled:bg-gray-400 text-[#1a1a1a] font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    {isSavingDetails ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // const generateWhatsAppMessage = () => {
  //   return `Hi, I have been approved for partnership and need the payment instructions. My reference ID is ${application.referenceId}.`;
  // };

  const handleUploadPaymentProof = async () => {
    if (!paymentProofFile || !application) return;

    try {
      setIsUploadingProof(true);
      const response = await uploadPaymentProof(
        application._id,
        paymentProofFile,
      );

      setApplication({
        ...application,
        paymentTracking: {
          ...application.paymentTracking,
          paymentProofUrl: response.data.paymentProofUrl,
          paymentProofUploadDate: response.data.uploadDate,
        },
      });

      setPaymentProofFile(null);
      setSuccessModal({
        isOpen: true,
        title: "Payment Proof Uploaded!",
        message:
          "Your payment proof has been successfully uploaded and sent to our team. We'll review it shortly.",
      });
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      setErrorModal({
        isOpen: true,
        title: "Upload Failed",
        message: "Failed to upload payment proof. Please try again.",
      });
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleSaveBankDetails = async () => {
    if (!application) return;

    const requiredFields = [
      "accountHolderName",
      "accountNumber",
      "bankName",
      "mailingAddress",
    ];
    const missingFields = requiredFields.filter(
      (field) => !bankDetails[field as keyof typeof bankDetails],
    );

    if (missingFields.length > 0) {
      setErrorModal({
        isOpen: true,
        title: "Missing Fields",
        message: `Please fill in: ${missingFields.join(", ")}`,
      });
      return;
    }

    try {
      setIsSavingDetails(true);
      const response = await updateAccountDetails(application._id, bankDetails);

      setApplication({
        ...application,
        bankDetails: response.data.bankDetails,
      });

      setSuccessModal({
        isOpen: true,
        title: "Bank Details Saved!",
        message:
          "Your bank account details have been successfully saved. You'll now see your partner dashboard.",
      });
      setShowBankEditForm(false);
    } catch (error) {
      console.error("Error saving bank details:", error);
      setErrorModal({
        isOpen: true,
        title: "Save Failed",
        message: "Failed to save bank details. Please try again.",
      });
    } finally {
      setIsSavingDetails(false);
    }
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return "";
    return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4);
  };

  const maskRoutingNumber = (routingNumber: string) => {
    if (!routingNumber || routingNumber.length < 3) return routingNumber;
    return "*".repeat(routingNumber.length - 3) + routingNumber.slice(-3);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessModal({
      isOpen: true,
      title: "Copied!",
      message: "Text copied to clipboard successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16 text-center fade-in-up">
          <div className="inline-block px-4 py-1.5 border border-[#d4af37]/50 text-xs font-semibold tracking-widest uppercase rounded-full mb-6 bg-[#f8f8f6]">
            <span className="text-[#d4af37]">Your Journey</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-3">
            Partnership <span className="text-[#d4af37]">Dashboard</span>
          </h1>
          <p className="text-[#6b6b6b] text-base md:text-lg max-w-2xl mx-auto">
            Track your application status, manage payments, and monitor your
            investment growth
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <i className="ri-loader-4-line animate-spin text-4xl text-[#d4af37] mb-3"></i>
              <p className="text-[#6b6b6b]">Loading your application...</p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center fade-in-up">
            <i className="ri-error-warning-fill text-5xl text-red-500 mb-4 block"></i>
            <p className="text-red-700 font-semibold mb-4 text-lg">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate("/partners")}
              className="px-7 py-3.5 bg-[#d4af37] hover:bg-[#c9a227] text-[#1a1a1a] font-semibold rounded-full transition-colors duration-300"
            >
              Create Application
            </button>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-20">
            {/* Application Status Card - Hidden for approved partners */}
            {!application.paymentTracking?.userConvertedToPartner && (
              <div
                className="bg-[#f8f8f6] rounded-2xl p-8 md:p-12 border border-gray-200 fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="mb-8">
                  <div className="inline-block px-4 py-1.5 border border-[#d4af37]/50 text-xs font-semibold tracking-widest uppercase rounded-full mb-4 bg-white">
                    <i className="ri-checkbox-circle-fill text-[#d4af37] mr-2"></i>
                    Your Status
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] mb-2">
                    Application Status
                  </h2>
                  <p className="text-[#6b6b6b] text-base">
                    Reference ID:{" "}
                    <span className="font-black text-[#d4af37]">
                      {application.referenceId}
                    </span>
                  </p>
                </div>

                <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-300">
                  <div></div>
                  <div
                    className={`border rounded-lg px-4 py-2 ${getStatusColor(
                      application.applicationStatus,
                    )}`}
                  >
                    <div className="flex items-center gap-2">
                      <i
                        className={`${getStatusIcon(
                          application.applicationStatus,
                        )} text-lg`}
                      ></i>
                      <span className="font-semibold capitalize">
                        {application.applicationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                  <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
                    <p className="text-[#6b6b6b] text-xs font-medium mb-2 uppercase tracking-wide">
                      Application Date
                    </p>
                    <p className="text-[#1a1a1a] font-black text-base">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 md:p-5 border border-yellow-200 border-dashed">
                    <p className="text-[#6b6b6b] text-xs font-medium mb-2 uppercase tracking-wide">
                      Investment Amount
                    </p>
                    <p className="text-[#d4af37] font-black text-base">
                      {formatCurrency(application.investmentAmount)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 md:p-5 border border-emerald-200 border-dashed">
                    <p className="text-[#6b6b6b] text-xs font-medium mb-2 uppercase tracking-wide">
                      Annual Return (60%)
                    </p>
                    <p className="text-emerald-600 font-black text-base">
                      {formatCurrency(application.projectedAnnualReturn)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-300">
                    <p className="text-[#6b6b6b] text-xs font-medium mb-2 uppercase tracking-wide">
                      Total (1 Year)
                    </p>
                    <p className="text-[#1a1a1a] font-black text-base">
                      {formatCurrency(application.totalValueAfterYear)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information - Only shown if approved and not yet a partner */}
            {application.applicationStatus === "approved" &&
              !application.paymentTracking?.userConvertedToPartner && (
                <div
                  className="bg-white rounded-2xl p-8 md:p-12 border border-gray-300 fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  {/* Header */}
                  <div className="mb-8">
                    <h3 className="text-3xl md:text-4xl font-black text-[#d4af37] mb-2">
                      Investment Payment
                    </h3>
                    <p className="text-[#1a1a1a] text-base">
                      Manage your payment method and track the status.
                    </p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] rounded-full">
                      <span className="text-[#1a1a1a] font-bold text-xs tracking-wider">
                        PAYMENT PROGRESS
                      </span>
                    </div>
                    {application.paymentTracking.status ===
                      "payment_requested" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] rounded-full ml-auto">
                        <i className="ri-mail-send-line text-[#1a1a1a]"></i>
                        <span className="text-[#1a1a1a] font-bold text-xs">
                          Payment Requested
                        </span>
                      </div>
                    )}
                    {application.paymentTracking.status === "received" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] rounded-full ml-auto">
                        <i className="ri-check-double-line text-[#1a1a1a]"></i>
                        <span className="text-[#1a1a1a] font-bold text-xs">
                          Payment Received
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Amount Due */}
                  <div className="text-center mb-8">
                    <p className="text-[#d4af37] text-lg font-black mb-2">
                      Amount Due for Investment
                    </p>
                    <p className="text-6xl md:text-7xl font-black text-[#d4af37]">
                      $
                      {new Intl.NumberFormat("en-US").format(
                        application.paymentTracking.amountDue,
                      )}
                    </p>
                  </div>

                  {/* Payment Instructions */}
                  {application.paymentTracking.status ===
                    "payment_requested" && (
                    <>
                      {application.paymentTracking.paymentInstructions &&
                      application.paymentTracking.paymentInstructions.trim() ? (
                        <>
                          {/* Payment Instructions Provided */}
                          <div className="bg-white border border-gray-300 rounded-2xl p-8 mb-8">
                            <h4 className="text-xl md:text-2xl font-black text-[#d4af37] mb-6 flex items-center gap-3">
                              <i className="ri-bank-card-line text-2xl"></i>
                              Payment Instructions Provided
                            </h4>

                            {/* Copyable Account Number */}
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-6">
                              <input
                                type="text"
                                value={
                                  application.paymentTracking
                                    .paymentInstructions || "N/A"
                                }
                                readOnly
                                placeholder="Copyable account number"
                                className="flex-1 px-4 py-3 bg-[#f5f5f0] border border-gray-300 rounded-lg text-[#1a1a1a] font-medium"
                              />
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    application.paymentTracking
                                      .paymentInstructions,
                                  );
                                  setSuccessModal({
                                    isOpen: true,
                                    title: "Copied!",
                                    message:
                                      "Payment instructions copied to clipboard.",
                                  });
                                }}
                                className="px-6 py-3 bg-[#d4af37] hover:bg-[#c9a227] text-[#1a1a1a] font-bold rounded-lg transition-colors whitespace-nowrap"
                              >
                                Copy Details
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    application.paymentTracking
                                      .paymentInstructions,
                                  );
                                  setSuccessModal({
                                    isOpen: true,
                                    title: "Copied!",
                                    message:
                                      "Payment instructions copied to clipboard.",
                                  });
                                }}
                                className="flex-1 px-6 py-3 bg-white border-2 border-[#d4af37] text-[#d4af37] font-bold rounded-full hover:bg-[#f9f9f6] transition-colors flex items-center justify-center gap-2"
                              >
                                <i className="ri-file-copy-line"></i>
                                Copy Details
                              </button>
                              {contactInfo?.whatsapp && (
                                <a
                                  href={`${contactInfo.whatsapp}?text=${encodeURIComponent(
                                    `I have received the payment instructions and will send the investment of ${formatCurrency(
                                      application.investmentAmount,
                                    )}. Reference ID: ${application.referenceId}`,
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 px-6 py-3 bg-white border-2 border-[#d4af37] text-[#d4af37] font-bold rounded-full hover:bg-[#f9f9f6] transition-colors flex items-center justify-center gap-2"
                                >
                                  <i className="ri-whatsapp-line"></i>
                                  Confirm via WhatsApp
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Upload Payment Proof */}
                          <div className="bg-white border border-gray-300 rounded-2xl p-8">
                            <h4 className="text-xl md:text-2xl font-black text-[#d4af37] mb-6 flex items-center gap-3">
                              <i className="ri-upload-cloud-2-line text-2xl"></i>
                              Upload Payment Proof
                            </h4>

                            {!application.paymentTracking.paymentProofUrl ? (
                              <div>
                                <input
                                  type="file"
                                  id="paymentProofInput"
                                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const maxSize = 10 * 1024 * 1024;
                                      if (file.size > maxSize) {
                                        setErrorModal({
                                          isOpen: true,
                                          title: "File Too Large",
                                          message:
                                            "File size exceeds 10MB limit. Please choose a smaller file.",
                                        });
                                        return;
                                      }
                                      setPaymentProofFile(file);
                                    }
                                  }}
                                />
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <button
                                    onClick={() => {
                                      document
                                        .getElementById("paymentProofInput")
                                        ?.click();
                                    }}
                                    className="flex-1 px-6 py-3 bg-white border-2 border-[#d4af37] text-[#d4af37] font-bold rounded-full hover:bg-[#f9f9f6] transition-colors flex items-center justify-center gap-2"
                                  >
                                    <i className="ri-folder-open-line"></i>
                                    Choose File
                                  </button>
                                  <button
                                    onClick={handleUploadPaymentProof}
                                    disabled={
                                      !paymentProofFile || isUploadingProof
                                    }
                                    className="flex-1 px-6 py-3 bg-[#d4af37] hover:bg-[#c9a227] disabled:bg-gray-400 text-[#1a1a1a] font-bold rounded-full transition-colors flex items-center justify-center gap-2"
                                  >
                                    {isUploadingProof ? (
                                      <>
                                        <span className="animate-spin">
                                          <i className="ri-loader-4-line"></i>
                                        </span>
                                        Sending...
                                      </>
                                    ) : (
                                      <>
                                        <i className="ri-send-plane-2-line"></i>
                                        Send Proof
                                      </>
                                    )}
                                  </button>
                                </div>
                                {paymentProofFile && (
                                  <p className="text-sm text-[#d4af37] mt-4">
                                    Selected: {paymentProofFile.name}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="bg-emerald-50 rounded-lg p-4 text-emerald-700 text-sm flex items-center gap-3">
                                  <i className="ri-file-check-line text-emerald-600 text-2xl flex-shrink-0"></i>
                                  <div>
                                    <p className="font-semibold">
                                      Proof Uploaded
                                    </p>
                                    <p className="text-emerald-600 text-xs">
                                      Uploaded on{" "}
                                      {new Date(
                                        application.paymentTracking
                                          .paymentProofUploadDate,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <a
                                  href={
                                    application.paymentTracking.paymentProofUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block px-6 py-3 text-center bg-[#d4af37] hover:bg-[#c9a227] text-[#1a1a1a] font-bold rounded-lg transition-colors"
                                >
                                  <i className="ri-external-link-line mr-2"></i>
                                  View Upload
                                </a>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="bg-white border border-gray-300 rounded-2xl p-8">
                          <div className="flex items-start gap-3">
                            <span className="inline-flex w-2 h-2 rounded-full bg-amber-400 animate-pulse mt-2 flex-shrink-0"></span>
                            <div>
                              <h4 className="font-black text-[#1a1a1a] text-base mb-2">
                                Awaiting Payment Instructions
                              </h4>
                              <p className="text-[#6b6b6b] text-sm">
                                Your admin is preparing the payment details for
                                the{" "}
                                <span className="font-semibold">
                                  {application.paymentTracking.requestedPaymentMethod?.replace(
                                    /_/g,
                                    " ",
                                  )}
                                </span>
                                . Please check back shortly.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Payment Received */}
                  {application.paymentTracking.status === "received" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                      <i className="ri-check-double-fill text-6xl text-emerald-500 mb-4 block"></i>
                      <h3 className="text-2xl font-black text-emerald-900 mb-3">
                        Payment Received!
                      </h3>
                      <p className="text-emerald-700 text-base mb-3">
                        Your investment payment has been confirmed. Thank you
                        for becoming a partner!
                      </p>
                      <p className="text-emerald-600 text-sm">
                        Payment received on:{" "}
                        <span className="font-bold">
                          {new Date(
                            application.paymentTracking.paymentReceivedDate,
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Awaiting Status */}
                  {application.paymentTracking.status === "awaiting" && (
                    <div className="bg-white border border-gray-300 rounded-2xl p-8 space-y-6">
                      <p className="text-[#1a1a1a] text-base">
                        Your application has been approved! Select your
                        preferred payment method below, and our team will
                        provide you with the payment instructions.
                      </p>

                      <div className="space-y-3">
                        <h5 className="font-black text-[#1a1a1a] text-sm uppercase tracking-wider">
                          Select Payment Method
                        </h5>

                        <div className="grid grid-cols-1 gap-2">
                          {[
                            {
                              value: "wire_transfer",
                              label: "Wire Transfer",
                              sub: "International",
                            },
                            {
                              value: "wire_check",
                              label: "Wire Check",
                              sub: "Domestic",
                            },
                            {
                              value: "ach_payment",
                              label: "ACH Payment",
                              sub: "Bank Transfer",
                            },
                          ].map((method) => (
                            <label
                              key={method.value}
                              className="flex items-center gap-3 p-3 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d4af37] transition-colors"
                            >
                              <input
                                type="radio"
                                name="payment_method"
                                value={method.value}
                                checked={selectedMethod === method.value}
                                onChange={(e) =>
                                  setSelectedMethod(e.target.value as any)
                                }
                                className="w-4 h-4"
                              />
                              <div>
                                <p className="font-semibold text-[#1a1a1a]">
                                  {method.label}
                                </p>
                                <p className="text-xs text-[#6b6b6b]">
                                  {method.sub}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (!selectedMethod) {
                            setErrorModal({
                              isOpen: true,
                              title: "Selection Required",
                              message:
                                "Please select a payment method before proceeding.",
                            });
                            return;
                          }
                          setShowMethodSelector(true);
                        }}
                        disabled={!selectedMethod || isSubmitting}
                        className="w-full px-6 py-3.5 bg-[#d4af37] hover:bg-[#c9a227] disabled:bg-gray-400 text-[#1a1a1a] font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <i className="ri-mail-send-line"></i>
                        {isSubmitting
                          ? "Requesting..."
                          : "Request Details for Selected Method"}
                      </button>
                    </div>
                  )}
                </div>
              )}

            {/* Partner Congratulations & Bank Details */}
            {application.applicationStatus === "approved" &&
              application.paymentTracking?.userConvertedToPartner && (
                <div
                  className="space-y-12 md:space-y-16 fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  {/* Congratulations Section - Hidden after bank details saved */}
                  {!application.bankDetails?.accountHolderName && (
                    <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200 text-center space-y-8">
                      {/* Medal Icon */}
                      <div className="flex justify-center">
                        <i className="ri-medal-fill text-7xl text-[#d4af37]"></i>
                      </div>

                      {/* Congratulations Message */}
                      <div>
                        <p className="text-[#1a1a1a] text-lg mb-2">
                          You are now an official partner of Pacific Crowns
                        </p>
                      </div>

                      {/* Financial Summary Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                        <div className="space-y-2">
                          <p className="text-[#6b6b6b] text-sm font-semibold uppercase tracking-wider">
                            Your Investment
                          </p>
                          <p className="text-4xl md:text-5xl font-black text-[#d4af37]">
                            {formatCurrency(application.investmentAmount)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[#6b6b6b] text-sm font-semibold uppercase tracking-wider">
                            Annual Return (60%)
                          </p>
                          <p className="text-4xl md:text-5xl font-black text-[#d4af37]">
                            {formatCurrency(application.projectedAnnualReturn)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[#6b6b6b] text-sm font-semibold uppercase tracking-wider">
                            Total After Year 1
                          </p>
                          <p className="text-4xl md:text-5xl font-black text-[#d4af37]">
                            {formatCurrency(application.totalValueAfterYear)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Details Section - Hidden after bank details saved */}
                  {!application.bankDetails?.accountHolderName && (
                    <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-200">
                      <div className="space-y-4">
                        {/* Account Holder Name */}
                        <div>
                          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Account Holder Name *
                          </label>
                          <input
                            type="text"
                            value={bankDetails.accountHolderName}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                accountHolderName: e.target.value,
                              })
                            }
                            placeholder="Full name as it appears on your account"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                          />
                        </div>

                        {/* Bank Name */}
                        <div>
                          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Bank Name *
                          </label>
                          <input
                            type="text"
                            value={bankDetails.bankName}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                bankName: e.target.value,
                              })
                            }
                            placeholder="e.g., Chase Bank, Bank of America"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                          />
                        </div>

                        {/* Account Type */}
                        <div>
                          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Account Type
                          </label>
                          <select
                            value={bankDetails.accountType}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                accountType: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                          >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                            <option value="money_market">Money Market</option>
                          </select>
                        </div>

                        {/* Account Number */}
                        <div>
                          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            value={bankDetails.accountNumber}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                accountNumber: e.target.value,
                              })
                            }
                            placeholder="Your account number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                          />
                        </div>

                        {/* Routing Number */}
                        <div>
                          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Routing Number (US)
                          </label>
                          <input
                            type="text"
                            value={bankDetails.routingNumber}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                routingNumber: e.target.value,
                              })
                            }
                            placeholder="9-digit routing number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                          />
                        </div>

                        {/* SWIFT Code */}
                        <div>
                          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            SWIFT Code (International)
                          </label>
                          <input
                            type="text"
                            value={bankDetails.swiftCode}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                swiftCode: e.target.value,
                              })
                            }
                            placeholder="SWIFT/BIC code for international transfers"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300"
                          />
                        </div>

                        {/* Mailing Address */}
                        <div>
                          <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Mailing Address *
                          </label>
                          <textarea
                            value={bankDetails.mailingAddress}
                            onChange={(e) =>
                              setBankDetails({
                                ...bankDetails,
                                mailingAddress: e.target.value,
                              })
                            }
                            placeholder="Your complete mailing address"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors duration-300 resize-none"
                          />
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={handleSaveBankDetails}
                          disabled={isSavingDetails}
                          className="w-full px-6 py-3.5 bg-[#d4af37] hover:bg-[#c9a227] disabled:bg-gray-400 text-[#1a1a1a] font-semibold rounded-full transition-colors duration-300 flex items-center justify-center gap-2 mt-6"
                        >
                          {isSavingDetails ? (
                            <>
                              <i className="ri-loader-4-line animate-spin"></i>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="ri-save-line"></i>
                              Save Bank Details
                            </>
                          )}
                        </button>

                        {/* Confirmation Message */}
                        {application.bankDetails?.accountHolderName && (
                          <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-4 mt-4">
                            <p className="text-emerald-800 font-semibold flex items-center gap-2">
                              <i className="ri-check-double-fill"></i>
                              Account details saved successfully
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Partner Final Dashboard - Shows after bank details are saved */}
                  {application.bankDetails?.accountHolderName && (
                    <PartnerFinalDashboard />
                  )}
                </div>
              )}

            {/* Rejection Notice */}
            {application.applicationStatus === "rejected" && (
              <div
                className="bg-red-50 border border-red-200 rounded-2xl p-6 md:p-8 fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-start gap-4">
                  <i className="ri-close-circle-fill text-3xl text-red-500 flex-shrink-0 mt-1"></i>
                  <div>
                    <h3 className="text-lg font-black text-red-900 mb-2">
                      Application Rejected
                    </h3>
                    <p className="text-red-700 text-sm mb-4">
                      {application.rejectionReason ||
                        "Your partnership application did not meet our current criteria."}
                    </p>
                    {contactInfo?.whatsapp && (
                      <a
                        href={`${contactInfo.whatsapp}?text=${encodeURIComponent(
                          `Hi, I received a rejection for my partnership application (Reference ID: ${application.referenceId}). Can I discuss this further?`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-lg transition-colors"
                      >
                        <i className="ri-whatsapp-line"></i>
                        Contact Us
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact & Support */}
            {application.applicationStatus === "pending" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8">
                <h3 className="text-lg font-black text-amber-900 mb-3 flex items-center gap-2">
                  <i className="ri-time-line"></i>Application Under Review
                </h3>
                <p className="text-amber-700 text-sm mb-4">
                  Your application is being reviewed by our team. We typically
                  respond within 24-48 hours. You can reach out to us anytime
                  for questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {contactInfo?.whatsapp && (
                    <a
                      href={contactInfo.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      <i className="ri-whatsapp-line"></i>
                      WhatsApp Support
                    </a>
                  )}
                  {contactInfo?.signal && (
                    <a
                      href={contactInfo.signal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3a76f0] hover:bg-[#2d63d4] text-white font-semibold rounded-lg transition-colors text-sm"
                    >
                      <i className="ri-signal-tower-line"></i>
                      Signal
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Method Confirmation Modal */}
        {showMethodSelector && selectedMethod && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-black text-[#1a1a1a]">
                  Confirm Payment Method Request
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-[#6b6b6b] text-sm">
                  You are requesting payment details for:
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-bold text-[#1a1a1a]">
                    {getPaymentMethodLabel(selectedMethod)}
                  </p>
                </div>
                <p className="text-[#6b6b6b] text-sm">
                  Our team will respond shortly with detailed payment
                  instructions for this method.
                </p>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowMethodSelector(false);
                    setSelectedMethod("");
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-[#6b6b6b] font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestPaymentMethod}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Confirming...
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line"></i>
                      Confirm & Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={successModal.isOpen}
          title={successModal.title}
          message={successModal.message}
          onClose={() =>
            setSuccessModal({ isOpen: false, title: "", message: "" })
          }
        />

        {/* Error Modal */}
        <ErrorModal
          isOpen={errorModal.isOpen}
          title={errorModal.title}
          message={errorModal.message}
          onClose={() =>
            setErrorModal({ isOpen: false, title: "", message: "" })
          }
        />
      </div>
    </div>
  );
}
