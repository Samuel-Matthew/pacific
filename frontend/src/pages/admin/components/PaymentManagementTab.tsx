import { useState, useEffect } from "react";
import {
  getAllApplications,
  getApplicationById,
  updatePaymentStatus,
  confirmPaymentAndChangeToPartner,
} from "@/api/partnerships";

interface PaymentApplication {
  _id: string;
  referenceId: string;
  userId: any;
  partnerInfo: {
    fullLegalName: string;
    email: string;
    phoneNumber: string;
  };
  investmentAmount: number;
  paymentTracking: {
    status: "awaiting" | "payment_requested" | "received";
    amountDue: number;
    requestedPaymentMethod?: string;
    paymentInstructions?: string;
    paymentProofUrl?: string;
    paymentProofUploadDate?: Date;
    paymentReceivedDate?: Date;
    userConvertedToPartner?: boolean;
  };
  projectedAnnualReturn: number;
  totalValueAfterYear: number;
}

export default function PaymentManagementTab() {
  const [applications, setApplications] = useState<PaymentApplication[]>([]);
  const [filteredApps, setFilteredApps] = useState<PaymentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<PaymentApplication | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "awaiting" | "payment_requested" | "received"
  >("awaiting");

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await getAllApplications({
        status: "approved",
      });
      setApplications(response.data);
      setFilteredApps(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;

    if (paymentFilter === "awaiting") {
      filtered = applications.filter(
        (app) => app.paymentTracking.status === "awaiting",
      );
    } else if (paymentFilter === "payment_requested") {
      filtered = applications.filter(
        (app) => app.paymentTracking.status === "payment_requested",
      );
    } else if (paymentFilter === "received") {
      filtered = applications.filter(
        (app) => app.paymentTracking.status === "received",
      );
    } else if (paymentFilter === "proof_pending") {
      filtered = applications.filter(
        (app) =>
          app.paymentTracking.status === "payment_requested" &&
          !app.paymentTracking.paymentProofUrl,
      );
    } else if (paymentFilter === "proof_ready") {
      filtered = applications.filter(
        (app) =>
          app.paymentTracking.status === "payment_requested" &&
          app.paymentTracking.paymentProofUrl &&
          !app.paymentTracking.userConvertedToPartner,
      );
    }

    setFilteredApps(filtered);
  }, [paymentFilter, applications]);

  const openModal = async (app: PaymentApplication) => {
    try {
      const response = await getApplicationById(app._id);
      const appData = response.data;
      setSelectedApp(appData);
      setPaymentStatus(appData.paymentTracking.status);
      setPaymentInstructions(appData.paymentTracking.paymentInstructions || "");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching application details:", error);
      alert("Failed to load application details");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
    setPaymentStatus("awaiting");
    setPaymentInstructions("");
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedApp) return;
    if (paymentStatus === "payment_requested" && !paymentInstructions.trim()) {
      alert(
        "Payment instructions are required. Please provide detailed payment instructions.",
      );
      return;
    }

    try {
      setActionLoading(true);
      await updatePaymentStatus(
        selectedApp._id,
        paymentStatus,
        paymentInstructions,
      );
      alert("Payment status updated!");
      fetchApplications();
      closeModal();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedApp) return;

    if (!selectedApp.paymentTracking?.paymentProofUrl) {
      alert("User must upload payment proof before confirming.");
      return;
    }

    if (selectedApp.paymentTracking?.userConvertedToPartner) {
      alert("User has already been converted to partner.");
      return;
    }

    try {
      setActionLoading(true);
      await confirmPaymentAndChangeToPartner(selectedApp._id);
      alert("Payment confirmed and user status updated to partner!");
      fetchApplications();
      closeModal();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Failed to confirm payment");
    } finally {
      setActionLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "awaiting":
        return "bg-gray-500/15 text-gray-400 border-gray-500/30";
      case "payment_requested":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "received":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace("_", " ").toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4">
        <h3 className="text-white font-bold mb-4 text-sm">
          Filter by Payment Status
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "All Applications" },
            {
              value: "awaiting",
              label: " Awaiting Payment",
              icon: "ri-hourglass-2-fill",
            },
            {
              value: "payment_requested",
              label: " Instructions Sent",
              icon: "ri-file-list-fill",
            },
            {
              value: "proof_pending",
              label: "Proof Pending",
              icon: "ri-pause-circle-fill",
            },
            {
              value: "proof_ready",
              label: "Proof Uploaded",
              icon: "ri-check-line",
            },
            {
              value: "received",
              label: "Confirmed",
              icon: "ri-check-double-fill",
            },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setPaymentFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                paymentFilter === filter.value
                  ? "bg-amber-500 text-white"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {filter.icon && <i className={`ri-sm ${filter.icon}`}></i>}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-amber-400 rounded-full"></div>
              </div>
              <p className="text-white/60 text-sm">Loading Payment Data...</p>
            </div>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-white/60 text-sm">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-1 py-1 md:px-6 md:py-4 text-left font-semibold text-white hidden sm:table-cell text-xs">
                    ID
                  </th>
                  <th className="px-1 py-1 md:px-6 md:py-4 text-left font-semibold text-white text-xs">
                    Partner
                  </th>
                  <th className="px-1 py-1 md:px-6 md:py-4 text-left font-semibold text-white hidden md:table-cell text-xs">
                    Investment
                  </th>
                  <th className="px-1 py-1 md:px-6 md:py-4 text-left font-semibold text-white text-xs">
                    Status
                  </th>
                  <th className="px-1 py-1 md:px-6 md:py-4 text-left font-semibold text-white hidden lg:table-cell text-xs">
                    Method
                  </th>
                  <th className="px-1 py-1 md:px-6 md:py-4 text-left font-semibold text-white hidden lg:table-cell text-xs">
                    Proof
                  </th>
                  <th className="px-1 py-1 md:px-6 md:py-4 text-left font-semibold text-white text-xs">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr
                    key={app._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-1 py-1 md:px-6 md:py-4 text-white font-mono text-xs hidden sm:table-cell truncate">
                      {app.referenceId.slice(-8)}
                    </td>
                    <td className="px-1 py-1 md:px-6 md:py-4 text-white text-xs">
                      <div className="truncate max-w-xs">
                        <p className="font-semibold text-xs truncate">
                          {app.partnerInfo.fullLegalName}
                        </p>
                        <p className="text-white/60 text-xs hidden md:block truncate">
                          {app.partnerInfo.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-1 py-1 md:px-6 md:py-4 text-white font-semibold text-xs hidden md:table-cell">
                      {formatCurrency(app.investmentAmount)}
                    </td>
                    <td className="px-1 py-1 md:px-6 md:py-4">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded border text-xs font-semibold ${getPaymentStatusColor(
                          app.paymentTracking.status,
                        )}`}
                      >
                        <span className="hidden sm:inline">
                          {getStatusLabel(app.paymentTracking.status)}
                        </span>
                        <span className="sm:hidden">
                          {getStatusLabel(app.paymentTracking.status).charAt(0)}
                        </span>
                      </span>
                    </td>
                    <td className="px-1 py-1 md:px-6 md:py-4 text-white/80 text-xs hidden lg:table-cell truncate">
                      {app.paymentTracking.requestedPaymentMethod ? (
                        <span className="capitalize text-xs">
                          {app.paymentTracking.requestedPaymentMethod
                            .replace(/_/g, " ")
                            .slice(0, 10)}
                        </span>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                    <td className="px-1 py-1 md:px-6 md:py-4 text-white/80 text-xs hidden lg:table-cell">
                      {app.paymentTracking.paymentProofUrl ? (
                        <a
                          href={app.paymentTracking.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <i className="ri-file-download-line"></i>
                        </a>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                    <td className="px-1 py-1 md:px-6 md:py-4">
                      <button
                        onClick={() => openModal(app)}
                        className="px-2 py-1 md:px-3 md:py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
                      >
                        <span className="hidden sm:inline">Manage</span>
                        <span className="sm:hidden">
                          <i className="ri-settings-line"></i>
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-white font-bold text-xl">
                Payment Management - {selectedApp.referenceId}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {selectedApp.partnerInfo.fullLegalName}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Investment Info */}
              <div className="bg-white/5 rounded-lg p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">
                  Investment Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Investment Amount</p>
                    <p className="text-white font-bold">
                      {formatCurrency(selectedApp.investmentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Due Amount</p>
                    <p className="text-white font-bold">
                      {formatCurrency(selectedApp.paymentTracking.amountDue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Projected Annual Return</p>
                    <p className="text-emerald-400 font-bold">
                      {formatCurrency(selectedApp.projectedAnnualReturn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Total Value After Year 1</p>
                    <p className="text-emerald-400 font-bold">
                      {formatCurrency(selectedApp.totalValueAfterYear)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Status Management */}
              <div className="bg-white/5 rounded-lg p-4 space-y-4">
                <h3 className="text-white font-semibold text-sm">
                  Payment Status
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Current Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) =>
                      setPaymentStatus(
                        e.target.value as
                          | "awaiting"
                          | "payment_requested"
                          | "received",
                      )
                    }
                    className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="awaiting">Awaiting Payment</option>
                    <option value="payment_requested">Instructions Sent</option>
                    <option value="received">Payment Confirmed</option>
                  </select>
                </div>

                {paymentStatus === "payment_requested" && (
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Payment Instructions
                    </label>
                    {selectedApp.paymentTracking.requestedPaymentMethod && (
                      <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-orange-300 mb-1">
                          Requested Payment Method
                        </p>
                        <p className="font-bold text-white capitalize">
                          {selectedApp.paymentTracking.requestedPaymentMethod.replace(
                            /_/g,
                            " ",
                          )}
                        </p>
                      </div>
                    )}
                    <textarea
                      value={paymentInstructions}
                      onChange={(e) => setPaymentInstructions(e.target.value)}
                      placeholder="Enter detailed payment instructions (account number, routing number, amount, deadline, etc.)..."
                      rows={5}
                      className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Payment Proof Section */}
              {selectedApp.paymentTracking.status === "payment_requested" && (
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <h3 className="text-white font-semibold text-sm">
                    Payment Proof Status
                  </h3>

                  {selectedApp.paymentTracking.paymentProofUrl ? (
                    <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 space-y-2">
                      <p className="text-emerald-300 font-semibold text-sm flex items-center gap-2">
                        <i className="ri-check-line"></i>
                        Payment Proof Uploaded
                      </p>
                      <a
                        href={selectedApp.paymentTracking.paymentProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 underline text-sm"
                      >
                        <i className="ri-external-link-line"></i>
                        View Proof Document
                      </a>
                      {selectedApp.paymentTracking.paymentProofUploadDate && (
                        <p className="text-xs text-emerald-400">
                          Uploaded:{" "}
                          {new Date(
                            selectedApp.paymentTracking.paymentProofUploadDate,
                          ).toLocaleDateString()}
                        </p>
                      )}
                      {!selectedApp.paymentTracking.userConvertedToPartner && (
                        <button
                          onClick={handleConfirmPayment}
                          disabled={actionLoading}
                          className="w-full mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {actionLoading ? (
                            <>
                              <span className="animate-spin">
                                <i className="ri-loader-4-line"></i>
                              </span>
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="ri-check-double-fill"></i>
                              Confirm &amp; Convert to Partner
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                      <p className="text-yellow-300 font-semibold text-sm">
                        ⏳ Awaiting Payment Proof
                      </p>
                      <p className="text-yellow-400/80 text-xs mt-1">
                        User will upload proof after making the payment
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedApp.paymentTracking.userConvertedToPartner && (
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4">
                  <p className="text-emerald-300 font-semibold text-sm">
                    ✓ User Converted to Partner
                  </p>
                  <p className="text-emerald-400/80 text-xs mt-1">
                    This partnership is now active
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="border-t border-white/10 p-6 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
              {paymentStatus !== "received" && (
                <button
                  onClick={handleUpdatePaymentStatus}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {actionLoading ? "Updating..." : "Update Status"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
