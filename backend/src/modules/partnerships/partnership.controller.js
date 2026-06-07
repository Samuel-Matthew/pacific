import PartnershipService from "./partnership.service.js";

// Create partnership application
export const createApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if ID document file was provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "ID document file is required",
        errors: ["ID document (PDF or image) must be provided"],
      });
    }

    // Parse FormData fields - partnerInfo is sent as JSON string
    let partnerInfo = {};
    let investmentAmount = 0;
    let signature = "";

    if (req.body.partnerInfo) {
      try {
        partnerInfo = JSON.parse(req.body.partnerInfo);
      } catch (e) {
        // If not JSON, treat as is
        partnerInfo = req.body.partnerInfo;
      }
    }

    if (req.body.investmentAmount) {
      investmentAmount = Number(req.body.investmentAmount);
    }

    if (req.body.signature) {
      signature = req.body.signature;
    }

    // Construct application data object
    const applicationData = {
      partnerInfo,
      investmentAmount,
      signature,
    };

    // Validate required fields
    const validationErrors =
      PartnershipService.validateApplicationData(applicationData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Upload ID document to Cloudinary
    const cloudinary = (await import("../../config/cloudinary.js")).default;
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "partnership-id-documents",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(req.file.buffer);
    });

    let uploadResult;
    try {
      uploadResult = await uploadPromise;
    } catch (uploadError) {
      console.error("Error uploading ID document to Cloudinary:", uploadError);
      return res.status(400).json({
        success: false,
        message: "Failed to upload ID document",
        error: uploadError.message,
      });
    }

    // Create application with ID document URL
    const application = await PartnershipService.createApplication(
      userId,
      applicationData,
      uploadResult.secure_url,
      req.file.originalname,
    );

    res.status(201).json({
      success: true,
      message: "Partnership application created successfully",
      data: {
        applicationId: application._id,
        referenceId: application.referenceId,
        status: application.applicationStatus,
        investmentAmount: application.investmentAmount,
        idDocumentUrl: application.idDocument.idDocumentUrl,
      },
    });
  } catch (error) {
    console.error("Error creating partnership application:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create application",
    });
  }
};

// Check if user has submitted an application or is already a partner
export const checkApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const isPartner = req.user.isPartner;

    // Check if user has any partnership application (regardless of status)
    const application = await PartnershipService.getUserApplication(userId);
    const hasApplication = !!application;

    res.status(200).json({
      success: true,
      data: {
        hasApplication,
        isPartner,
      },
    });
  } catch (error) {
    // If no application found, that's not an error for this endpoint
    const isPartner = req.user.isPartner;
    res.status(200).json({
      success: true,
      data: {
        hasApplication: false,
        isPartner,
      },
    });
  }
};

// Get user's application
export const getUserApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const application = await PartnershipService.getUserApplication(userId);

    // Enrich with calculated fields
    const enrichedApplication =
      PartnershipService.enrichApplicationData(application);

    res.status(200).json({
      success: true,
      data: enrichedApplication,
    });
  } catch (error) {
    console.error("Error fetching user application:", error);
    res.status(404).json({
      success: false,
      message: error.message || "Application not found",
    });
  }
};

// Update application
export const updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const application =
      await PartnershipService.getApplicationById(applicationId);
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this application",
      });
    }

    const updated = await PartnershipService.updateApplication(
      applicationId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update application",
    });
  }
};

// ===== ADMIN ROUTES =====

// Get all applications (admin)
export const getAllApplications = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      minAmount: req.query.minAmount ? Number(req.query.minAmount) : null,
      maxAmount: req.query.maxAmount ? Number(req.query.maxAmount) : null,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    // Remove null filters
    Object.keys(filters).forEach(
      (key) => filters[key] === null && delete filters[key],
    );

    const applications = await PartnershipService.getAllApplications(filters);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// Get single application (admin)
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application =
      await PartnershipService.getApplicationById(applicationId);

    // Enrich with calculated fields
    const enrichedApplication =
      PartnershipService.enrichApplicationData(application);

    res.status(200).json({
      success: true,
      data: enrichedApplication,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(404).json({
      success: false,
      message: error.message || "Application not found",
    });
  }
};

// Approve application (admin)
export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;

    const application = await PartnershipService.approveApplication(
      applicationId,
      notes,
    );

    res.status(200).json({
      success: true,
      message: "Application approved successfully",
      data: {
        applicationId: application._id,
        status: application.applicationStatus,
        referenceId: application.referenceId,
      },
    });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to approve application",
    });
  }
};

// Reject application (admin)
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;

    const application = await PartnershipService.rejectApplication(
      applicationId,
      reason,
    );

    res.status(200).json({
      success: true,
      message: "Application rejected",
      data: {
        applicationId: application._id,
        status: application.applicationStatus,
        reason: application.rejectionReason,
      },
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reject application",
    });
  }
};

// Update payment status (admin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { paymentStatus, paymentInstructions } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    // Only send payment request email if paymentInstructions are explicitly provided
    const shouldSendEmail = !!(
      paymentInstructions && paymentInstructions.trim()
    );

    const application = await PartnershipService.updatePaymentStatus(
      applicationId,
      paymentStatus,
      paymentInstructions,
      shouldSendEmail,
    );

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: {
        applicationId: application._id,
        paymentStatus: application.paymentTracking.status,
        amountDue: application.paymentTracking.amountDue,
        paymentReceivedDate: application.paymentTracking.paymentReceivedDate,
        emailSent: shouldSendEmail,
      },
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment status",
    });
  }
};

// Request payment method details (user)
export const requestPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.params;
    const { paymentMethod } = req.body;

    // Verify ownership
    const application =
      await PartnershipService.getApplicationById(applicationId);
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this application",
      });
    }

    if (
      !paymentMethod ||
      !["wire_transfer", "wire_check", "ach_payment"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const updated = await PartnershipService.requestPaymentMethod(
      applicationId,
      paymentMethod,
    );

    res.status(200).json({
      success: true,
      message: "Payment method request sent to admin",
      data: {
        applicationId: updated._id,
        requestedPaymentMethod: updated.paymentTracking.requestedPaymentMethod,
        status: updated.paymentTracking.status,
      },
    });
  } catch (error) {
    console.error("Error requesting payment method:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to request payment method",
    });
  }
};

// Upload payment proof (user)
export const uploadPaymentProof = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment proof file is required",
      });
    }

    // Verify ownership
    const application =
      await PartnershipService.getApplicationById(applicationId);
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to upload for this application",
      });
    }

    // Upload to Cloudinary
    const cloudinary = (await import("../../config/cloudinary.js")).default;
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "partnership-payments",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(req.file.buffer);
    });

    const uploadResult = await uploadPromise;

    // Save proof URL to application
    const updated = await PartnershipService.uploadPaymentProof(
      applicationId,
      userId,
      uploadResult.secure_url,
    );

    res.status(200).json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: {
        applicationId: updated._id,
        paymentProofUrl: updated.paymentTracking.paymentProofUrl,
        uploadDate: updated.paymentTracking.paymentProofUploadDate,
      },
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload payment proof",
    });
  }
};

// Upload ID document (user)
export const uploadIdDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "ID document file is required",
      });
    }

    // Verify ownership
    const application =
      await PartnershipService.getApplicationById(applicationId);
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to upload for this application",
      });
    }

    // Upload to Cloudinary
    const cloudinary = (await import("../../config/cloudinary.js")).default;
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "partnership-id-documents",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(req.file.buffer);
    });

    const uploadResult = await uploadPromise;

    // Save ID document URL to application
    const updated = await PartnershipService.uploadIdDocument(
      applicationId,
      userId,
      uploadResult.secure_url,
      req.file.originalname,
    );

    res.status(200).json({
      success: true,
      message: "ID document uploaded successfully",
      data: {
        applicationId: updated._id,
        idDocumentUrl: updated.idDocument.idDocumentUrl,
        fileName: updated.idDocument.fileName,
        uploadDate: updated.idDocument.idDocumentUploadDate,
      },
    });
  } catch (error) {
    console.error("Error uploading ID document:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload ID document",
    });
  }
};

// Confirm payment and change user to partner (admin)
export const confirmPaymentAndChangeToPartner = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Get application
    const application =
      await PartnershipService.getApplicationById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (!application.paymentTracking.paymentProofUrl) {
      return res.status(400).json({
        success: false,
        message: "Payment proof must be uploaded before confirming",
      });
    }

    if (application.paymentTracking.userConvertedToPartner) {
      return res.status(400).json({
        success: false,
        message: "User has already been converted to partner",
      });
    }

    // Import User model properly
    const { default: User } = await import("../users/user.model.js");

    // Update user as partner
    await User.updateOne({ _id: application.userId }, { isPartner: true });

    // Mark user as converted to partner
    application.paymentTracking.userConvertedToPartner = true;
    application.paymentTracking.paymentReceivedDate = new Date();
    await application.save();

    res.status(200).json({
      success: true,
      message: "User successfully converted to partner",
      data: {
        applicationId: application._id,
        userConvertedToPartner:
          application.paymentTracking.userConvertedToPartner,
        paymentReceivedDate: application.paymentTracking.paymentReceivedDate,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm payment",
    });
  }
};

// Update account details (user)
export const updateAccountDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId } = req.params;
    const { bankDetails } = req.body;

    // Verify ownership
    const application =
      await PartnershipService.getApplicationById(applicationId);
    if (application.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this application",
      });
    }

    if (!application.paymentTracking?.userConvertedToPartner) {
      return res.status(400).json({
        success: false,
        message:
          "Account details can only be updated after confirming as partner",
      });
    }

    // Update bank details
    if (bankDetails) {
      application.bankDetails = {
        accountHolderName: bankDetails.accountHolderName || null,
        accountNumber: bankDetails.accountNumber || null,
        routingNumber: bankDetails.routingNumber || null,
        bankName: bankDetails.bankName || null,
        accountType: bankDetails.accountType || null,
        swiftCode: bankDetails.swiftCode || null,
        mailingAddress: bankDetails.mailingAddress || null,
      };
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: "Account details updated successfully",
      data: {
        applicationId: application._id,
        bankDetails: application.bankDetails,
      },
    });
  } catch (error) {
    console.error("Error updating account details:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update account details",
    });
  }
};
