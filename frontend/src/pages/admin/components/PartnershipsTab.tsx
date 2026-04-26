import { useState, useEffect } from "react";
import {
  getAllApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
  updatePaymentStatus,
  confirmPaymentAndChangeToPartner,
} from "@/api/partnerships";

interface Application {
  _id: string;
  referenceId: string;
  userId: any;
  partnerInfo: {
    fullLegalName: string;
    email: string;
    phoneNumber: string;
  };
  investmentAmount: number;
  applicationStatus: "pending" | "approved" | "rejected";
  paymentTracking: {
    status: "awaiting" | "payment_requested" | "received";
    amountDue: number;
    paymentInstructions?: string;
  };
  createdAt: string;
}

export default function PartnershipsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await getAllApplications();
      setApplications(response.data);
      setErrorMessage("");
    } catch (error: any) {
      console.error("Error fetching applications:", error);
      setErrorMessage("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = async (app: Application) => {
    try {
      setModalLoading(true);
      const response = await getApplicationDetails(app._id);
      setSelectedApp(response.data);
      setPaymentStatus(response.data.paymentTracking.status);
      setPaymentInstructions(
        response.data.paymentTracking.paymentInstructions || "",
      );
      setAdminNotes(response.data.adminNotes || "");
      setModalOpen(true);
    } catch (error) {
      console.error("Error loading application details:", error);
      alert("Failed to load application details");
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedApp(null);
    setPaymentInstructions("");
    setPaymentStatus("");
    setAdminNotes("");
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    try {
      setActionLoading(true);
      await approveApplication(selectedApp._id, adminNotes);
      alert("Application approved!");
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    if (!adminNotes.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      setActionLoading(true);
      await rejectApplication(selectedApp._id, adminNotes);
      alert("Application rejected!");
      closeModal();
      fetchApplications();
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!selectedApp) return;
    if (paymentStatus === "payment_requested" && !paymentInstructions.trim()) {
      alert(
        "Payment instructions are required. Please provide detailed payment instructions for the user.",
      );
      return;
    }
    try {
      setActionLoading(true);
      await updatePaymentStatus(
        selectedApp._id,
        paymentStatus as "awaiting" | "payment_requested" | "received",
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

  const handleConfirmPaymentAndChangeToPartner = async () => {
    if (!selectedApp) return;

    if (!selectedApp.paymentTracking?.paymentProofUrl) {
      alert("User must upload payment proof before confirming partner status.");
      return;
    }

    if (selectedApp.paymentTracking?.userConvertedToPartner) {
      alert("User has already been converted to partner.");
      return;
    }

    try {
      setActionLoading(true);
      await confirmPaymentAndChangeToPartner(selectedApp._id);
      alert("User successfully confirmed as partner!");
      fetchApplications();
      closeModal();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Failed to confirm payment and change user to partner");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "approved":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status) {
      case "awaiting":
        return "bg-slate-500/15 text-slate-300 border-slate-500/30";
      case "payment_requested":
        return "bg-orange-500/15 text-orange-400 border-orange-500/30";
      case "received":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          Partnership Applications
        </h3>
        <button
          onClick={fetchApplications}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
        >
          <i className="ri-refresh-line mr-2"></i>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <i className="ri-loader-4-line animate-spin text-3xl text-blue-600 mb-2"></i>
            <p className="text-white">Loading applications...</p>
          </div>
        </div>
      ) : errorMessage ? (
        <div className="bg-red-500/15 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400 font-semibold mb-4">{errorMessage}</p>
          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
          <i className="ri-inbox-line text-4xl text-white/40 mb-4 block"></i>
          <p className="text-white/60">No partnership applications yet.</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-white/70 uppercase">
                  Partner Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white/70 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white/70 uppercase">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white/70 uppercase">
                  App Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white/70 uppercase">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white/70 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-white/70 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-white">
                    {app.partnerInfo.fullLegalName}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {app.partnerInfo.email}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-400">
                    {formatCurrency(app.investmentAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.applicationStatus)}`}
                    >
                      {app.applicationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(app.paymentTracking.status)}`}
                    >
                      {app.paymentTracking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => openModal(app)}
                      disabled={modalLoading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {modalOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Application Details
              </h2>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Reference ID & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Reference ID</p>
                  <p className="font-bold text-white">
                    {selectedApp.referenceId}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedApp.applicationStatus)}`}
                  >
                    {selectedApp.applicationStatus}
                  </span>
                </div>
              </div>

              {/* Partner Information */}
              <div>
                <h3 className="font-bold text-white mb-4">
                  Partner Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60 mb-1">
                      Full Legal Name
                    </p>
                    <p className="font-semibold text-white">
                      {selectedApp.partnerInfo.fullLegalName}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60 mb-1">Email</p>
                    <p className="font-semibold text-white">
                      {selectedApp.partnerInfo.email}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60 mb-1">Phone Number</p>
                    <p className="font-semibold text-white">
                      {selectedApp.partnerInfo.phoneNumber}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60 mb-1">Home Address</p>
                    <p className="font-semibold text-white text-sm">
                      {selectedApp.partnerInfo.homeAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* ID Verification Section */}
              <div>
                <h3 className="font-bold text-white mb-4">ID Verification</h3>
                {selectedApp.partnerInfo.idType && selectedApp.idDocument ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <p className="text-xs text-white/60 mb-1">ID Type</p>
                        <p className="font-semibold text-white capitalize">
                          {selectedApp.partnerInfo.idType.replace(/_/g, " ")}
                        </p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <p className="text-xs text-white/60 mb-1">
                          Upload Date
                        </p>
                        <p className="font-semibold text-white">
                          {selectedApp.idDocument.uploadDate
                            ? new Date(
                                selectedApp.idDocument.uploadDate,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {selectedApp.idDocument.idDocumentUrl && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                        <p className="text-xs text-blue-300 font-semibold">
                          Document Preview
                        </p>
                        {selectedApp.idDocument.idDocumentUrl.endsWith(
                          ".pdf",
                        ) ? (
                          <div className="space-y-2">
                            <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                              <div className="text-center">
                                <i className="ri-file-pdf-line text-red-500 text-5xl mb-2 block"></i>
                                <p className="text-white/60 text-sm mb-3">
                                  {selectedApp.idDocument.fileName ||
                                    "ID Document"}
                                </p>
                              </div>
                            </div>
                            <a
                              href={selectedApp.idDocument.idDocumentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                              <i className="ri-external-link-line"></i>
                              Open PDF in New Tab
                            </a>
                          </div>
                        ) : (
                          <a
                            href={selectedApp.idDocument.idDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={selectedApp.idDocument.idDocumentUrl}
                              alt="ID Document"
                              className="w-full h-auto rounded-lg border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer"
                            />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ) : selectedApp.partnerInfo.idType ? (
                  <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      <i className="ri-information-line mr-2"></i>
                      ID type selected (
                      {selectedApp.partnerInfo.idType.replace(/_/g, " ")}), but
                      document not yet uploaded by partner.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-500/15 border border-gray-500/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">
                      <i className="ri-information-line mr-2"></i>
                      No ID verification document submitted yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Investment Information */}
              <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">
                  Investment Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Amount</p>
                    <p className="text-xl font-bold text-amber-400">
                      {formatCurrency(selectedApp.investmentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">
                      Projected Annual Return (60%)
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      {formatCurrency(
                        selectedApp.projectedAnnualReturn ||
                          selectedApp.investmentAmount * 0.6,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bank Details (only if available) */}
              {selectedApp.bankDetails?.accountHolderName && (
                <div>
                  <h3 className="font-bold text-white mb-3">Bank Details</h3>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Account Holder:</span>
                      <span className="font-semibold text-white">
                        {selectedApp.bankDetails.accountHolderName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Bank Name:</span>
                      <span className="font-semibold text-white">
                        {selectedApp.bankDetails.bankName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Account Number:</span>
                      <span className="font-semibold text-white font-mono">
                        ••••{selectedApp.bankDetails.accountNumber?.slice(-4)}
                      </span>
                    </div>
                    {selectedApp.bankDetails.routingNumber && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Routing Number:</span>
                        <span className="font-semibold text-white font-mono">
                          {selectedApp.bankDetails.routingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!selectedApp.bankDetails?.accountHolderName && (
                <div className="bg-blue-500/15 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-blue-400 text-sm">
                    <i className="ri-information-line mr-2"></i>
                    Bank details not yet provided by partner. Will be collected
                    when they request payment instructions.
                  </p>
                </div>
              )}

              {/* Payment Tracking */}
              {selectedApp.applicationStatus === "approved" && (
                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-bold text-white mb-4">
                    Payment Tracking
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Payment Status
                      </label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="awaiting">Awaiting</option>
                        <option value="payment_requested">
                          Payment Requested
                        </option>
                        <option value="received">Received</option>
                      </select>
                    </div>

                    {paymentStatus === "payment_requested" && (
                      <div className="space-y-4">
                        {selectedApp.paymentTracking.requestedPaymentMethod && (
                          <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                            <p className="text-xs text-orange-300 mb-1">
                              Requested Payment Method
                            </p>
                            <p className="font-bold text-white">
                              {selectedApp.paymentTracking
                                .requestedPaymentMethod === "wire_transfer"
                                ? "Wire Transfer (International)"
                                : selectedApp.paymentTracking
                                      .requestedPaymentMethod === "wire_check"
                                  ? "Wire Check (Domestic)"
                                  : "ACH Payment (Bank Transfer)"}
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">
                            Payment Instructions
                          </label>
                          <textarea
                            value={paymentInstructions}
                            onChange={(e) =>
                              setPaymentInstructions(e.target.value)
                            }
                            placeholder="Provide detailed payment instructions for the partner (including account details, amounts, deadlines, etc.)..."
                            rows={6}
                            className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {paymentStatus === "received" && (
                      <div className="space-y-4">
                        {selectedApp.paymentTracking?.paymentProofUrl ? (
                          <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 space-y-3">
                            <p className="text-xs text-emerald-300 mb-1">
                              Payment Proof Uploaded
                            </p>
                            <a
                              href={selectedApp.paymentTracking.paymentProofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 underline text-sm"
                            >
                              <i className="ri-external-link-line"></i>
                              View Payment Proof
                            </a>
                            {selectedApp.paymentTracking
                              .paymentProofUploadDate && (
                              <p className="text-xs text-emerald-400">
                                Uploaded:{" "}
                                {new Date(
                                  selectedApp.paymentTracking
                                    .paymentProofUploadDate,
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                            <p className="text-xs text-yellow-300">
                              ⏳ User is pending payment proof upload
                            </p>
                          </div>
                        )}

                        {selectedApp.paymentTracking?.paymentProofUrl &&
                          !selectedApp.paymentTracking
                            ?.userConvertedToPartner && (
                            <button
                              onClick={handleConfirmPaymentAndChangeToPartner}
                              disabled={actionLoading}
                              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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
                                  Confirm Payment &amp; Change to Partner
                                </>
                              )}
                            </button>
                          )}

                        {selectedApp.paymentTracking
                          ?.userConvertedToPartner && (
                          <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4">
                            <p className="text-xs text-emerald-300">
                              ✓ User has been converted to partner
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleUpdatePaymentStatus}
                      disabled={actionLoading}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                    >
                      {actionLoading ? "Updating..." : "Update Payment Status"}
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Notes & Actions */}
              {selectedApp.applicationStatus === "pending" && (
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder={
                        "Enter approval notes or rejection reason..."
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                    >
                      {actionLoading ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                    >
                      {actionLoading ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
