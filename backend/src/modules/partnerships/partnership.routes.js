import express from "express";
import { protect } from "../auth/auth.middleware.js";
import { requireAdmin } from "../admin/admin.middleware.js";
import uploadPaymentProof from "../../middlewares/uploadPaymentProof.js";
import uploadIdDocument from "../../middlewares/uploadIdDocument.js";
import * as PartnershipController from "./partnership.controller.js";

const router = express.Router();

// ===== USER ROUTES =====

// Create partnership application with ID document (authenticated users)
router.post(
  "/apply",
  protect,
  uploadIdDocument.single("idDocument"),
  PartnershipController.createApplication,
);

// Check if user has application or is partner (authenticated users)
router.get(
  "/check-status",
  protect,
  PartnershipController.checkApplicationStatus,
);

// Get user's own application (authenticated users)
router.get(
  "/my-application",
  protect,
  PartnershipController.getUserApplication,
);

// Update user's application (authenticated users)
router.put("/:applicationId", protect, PartnershipController.updateApplication);

// Request payment method details (authenticated users)
router.patch(
  "/:applicationId/request-payment-method",
  protect,
  PartnershipController.requestPaymentMethod,
);

// Upload payment proof (authenticated users)
router.post(
  "/:applicationId/upload-payment-proof",
  protect,
  uploadPaymentProof.single("paymentProof"),
  PartnershipController.uploadPaymentProof,
);

// Upload ID document (authenticated users)
router.post(
  "/:applicationId/upload-id-document",
  protect,
  uploadIdDocument.single("idDocument"),
  PartnershipController.uploadIdDocument,
);

// ===== ADMIN ROUTES =====

// Get all partnership applications (admin only)
router.get(
  "/admin/list",
  protect,
  requireAdmin,
  PartnershipController.getAllApplications,
);

// Get single application details (admin only)
router.get(
  "/admin/:applicationId",
  protect,
  requireAdmin,
  PartnershipController.getApplicationById,
);

// Approve application (admin only)
router.patch(
  "/admin/:applicationId/approve",
  protect,
  requireAdmin,
  PartnershipController.approveApplication,
);

// Reject application (admin only)
router.patch(
  "/admin/:applicationId/reject",
  protect,
  requireAdmin,
  PartnershipController.rejectApplication,
);

// Update payment status (admin only)
router.patch(
  "/admin/:applicationId/payment-status",
  protect,
  requireAdmin,
  PartnershipController.updatePaymentStatus,
);

// Confirm payment and change user to partner (admin only)
router.patch(
  "/admin/:applicationId/confirm-payment-partner",
  protect,
  requireAdmin,
  PartnershipController.confirmPaymentAndChangeToPartner,
);

// Update account details for payment proceeds (user)
router.patch(
  "/:applicationId/account-details",
  protect,
  PartnershipController.updateAccountDetails,
);

export default router;
