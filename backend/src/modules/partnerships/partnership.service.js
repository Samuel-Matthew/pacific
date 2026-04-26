import PartnershipApplication from "./partnership.model.js";
import EmailService from "../../services/emailService.js";

class PartnershipService {
  // Create new partnership application
  async createApplication(
    userId,
    applicationData,
    idDocumentUrl,
    idDocumentFileName,
  ) {
    try {
      const existingApp = await PartnershipApplication.findOne({
        userId,
        applicationStatus: { $in: ["pending", "approved"] },
      });

      if (existingApp) {
        throw new Error(
          "You already have an active partnership application. Please wait for approval.",
        );
      }

      const paymentTracking = {
        status: "awaiting",
        amountDue: applicationData.investmentAmount,
      };

      // Prepare ID document data
      const idDocument = {
        idDocumentUrl: idDocumentUrl || null,
        fileName: idDocumentFileName || null,
        idDocumentUploadDate: idDocumentUrl ? new Date() : null,
      };

      const newApplication = new PartnershipApplication({
        userId,
        ...applicationData,
        paymentTracking,
        idDocument,
      });

      await newApplication.save();

      // Send application confirmation email
      try {
        await EmailService.sendApplicationSubmitted(
          newApplication.partnerInfo,
          newApplication.referenceId,
          newApplication._id.toString(),
          newApplication.investmentAmount,
        );
      } catch (emailError) {
        console.error(
          "✗ Failed to send application confirmation email:",
          emailError.message,
        );
        // Don't throw - email failure shouldn't break application creation
      }

      return newApplication;
    } catch (error) {
      throw error;
    }
  }

  // Get user's application
  async getUserApplication(userId) {
    try {
      const application = await PartnershipApplication.findOne({
        userId,
      }).populate("userId", "name email");

      if (!application) {
        throw new Error("No partnership application found for this user.");
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  // Update application (for drafts/changes)
  async updateApplication(applicationId, updateData) {
    try {
      // Don't allow status updates through this method
      const { applicationStatus, referenceId, ...safeUpdateData } = updateData;

      const application = await PartnershipApplication.findByIdAndUpdate(
        applicationId,
        safeUpdateData,
        { new: true, runValidators: true },
      );

      if (!application) {
        throw new Error("Application not found.");
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  // Get all applications (admin only)
  async getAllApplications(filters = {}) {
    try {
      const query = {};

      if (filters.status) {
        query.applicationStatus = filters.status;
      }

      if (filters.paymentStatus) {
        query["paymentTracking.status"] = filters.paymentStatus;
      }

      if (filters.minAmount) {
        query.investmentAmount = { $gte: filters.minAmount };
      }

      if (filters.maxAmount) {
        query.investmentAmount = {
          ...query.investmentAmount,
          $lte: filters.maxAmount,
        };
      }

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
          query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.createdAt.$lte = new Date(filters.endDate);
        }
      }

      const applications = await PartnershipApplication.find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      return applications;
    } catch (error) {
      throw error;
    }
  }

  // Get single application (admin)
  async getApplicationById(applicationId) {
    try {
      const application = await PartnershipApplication.findById(
        applicationId,
      ).populate("userId", "name email phone");

      if (!application) {
        throw new Error("Application not found.");
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  // Approve application
  async approveApplication(applicationId, notes = "") {
    try {
      const application = await PartnershipApplication.findByIdAndUpdate(
        applicationId,
        {
          applicationStatus: "approved",
          adminNotes: notes,
        },
        { new: true },
      );

      if (!application) {
        throw new Error("Application not found.");
      }

      // Send approval email
      try {
        await EmailService.sendApplicationApproved(
          application.partnerInfo,
          application.referenceId,
          application.investmentAmount,
        );
      } catch (emailError) {
        console.error("✗ Failed to send approval email:", emailError.message);
        // Don't throw - email failure shouldn't break approval process
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  // Reject application
  async rejectApplication(applicationId, reason = "") {
    try {
      const application = await PartnershipApplication.findByIdAndUpdate(
        applicationId,
        {
          applicationStatus: "rejected",
          rejectionReason: reason,
        },
        { new: true },
      );

      if (!application) {
        throw new Error("Application not found.");
      }

      // Send rejection email
      try {
        await EmailService.sendApplicationRejected(
          application.partnerInfo,
          application.referenceId,
          application.rejectionReason || "",
        );
      } catch (emailError) {
        console.error("✗ Failed to send rejection email:", emailError.message);
        // Don't throw - email failure shouldn't break rejection process
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  // Update payment status and instructions
  // Only sends payment request email if shouldSendEmail is true AND instructions are provided
  async updatePaymentStatus(
    applicationId,
    paymentStatus,
    instructions = "",
    shouldSendEmail = false,
  ) {
    try {
      const updateData = {
        "paymentTracking.status": paymentStatus,
      };

      if (instructions) {
        updateData["paymentTracking.paymentInstructions"] = instructions;
      }

      if (paymentStatus === "received") {
        updateData["paymentTracking.paymentReceivedDate"] = new Date();
      }

      const application = await PartnershipApplication.findByIdAndUpdate(
        applicationId,
        updateData,
        { new: true },
      );

      if (!application) {
        throw new Error("Application not found.");
      }

      // Send appropriate email based on payment status
      try {
        if (
          paymentStatus === "payment_requested" &&
          shouldSendEmail &&
          instructions
        ) {
          await EmailService.sendPaymentRequest(
            application.partnerInfo,
            application.referenceId,
            application.investmentAmount,
            instructions,
          );
        } else if (paymentStatus === "received") {
          await EmailService.sendPaymentReceived(
            application.partnerInfo,
            application.referenceId,
            application.investmentAmount,
          );
        }
      } catch (emailError) {
        console.error(
          "✗ Failed to send payment notification email:",
          emailError.message,
        );
        // Don't throw - email failure shouldn't break payment status update
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  // Request payment method details
  // No longer sends email automatically - admin controls when payment request email is sent
  async requestPaymentMethod(applicationId, paymentMethod) {
    try {
      const application = await PartnershipApplication.findByIdAndUpdate(
        applicationId,
        {
          "paymentTracking.status": "payment_requested",
          "paymentTracking.requestedPaymentMethod": paymentMethod,
        },
        { new: true },
      );

      if (!application) {
        throw new Error("Application not found.");
      }

      return application;
    } catch (error) {
      throw error;
    }
  }

  // Enrich application with calculated fields for frontend display
  enrichApplicationData(application) {
    const appObj = application.toObject ? application.toObject() : application;

    // Calculate projected annual return (15% per quarter = 60% annual)
    const projectedAnnualReturn = appObj.investmentAmount * 0.6;

    // Calculate total value after one year
    const totalValueAfterYear = appObj.investmentAmount + projectedAnnualReturn;

    return {
      ...appObj,
      projectedAnnualReturn,
      totalValueAfterYear,
    };
  }

  // Validate application data
  validateApplicationData(data) {
    const errors = [];

    // Partner Info validations
    if (!data.partnerInfo?.fullLegalName) {
      errors.push("Full legal name is required");
    }
    if (!data.partnerInfo?.email) {
      errors.push("Email is required");
    }
    if (!data.partnerInfo?.phoneNumber) {
      errors.push("Phone number is required");
    }
    if (!data.partnerInfo?.homeAddress) {
      errors.push("Home address is required");
    }
    if (!data.partnerInfo?.incomeSource) {
      errors.push("Income source is required");
    }
    if (!data.partnerInfo?.annualIncome) {
      errors.push("Annual income is required");
    }
    if (!data.partnerInfo?.idType) {
      errors.push("ID type is required");
    }
    if (!data.partnerInfo?.agreementDate) {
      errors.push("Agreement date is required");
    }
    if (!data.partnerInfo?.printedName) {
      errors.push("Printed name is required");
    }

    // Investment and signature validations
    if (
      !data.investmentAmount ||
      data.investmentAmount < 55000 ||
      data.investmentAmount > 500000
    ) {
      errors.push("Investment amount must be between $55,000 and $500,000");
    }
    if (!data.signature) {
      errors.push("Signature is required");
    }

    return errors;
  }

  // Upload payment proof
  async uploadPaymentProof(applicationId, userId, paymentProofUrl) {
    try {
      const application = await PartnershipApplication.findOne({
        _id: applicationId,
        userId,
      });

      if (!application) {
        throw new Error("Application not found or unauthorized access");
      }

      if (application.paymentTracking.status !== "payment_requested") {
        throw new Error(
          "Payment proof can only be uploaded after payment instructions have been provided",
        );
      }

      application.paymentTracking.paymentProofUrl = paymentProofUrl;
      application.paymentTracking.paymentProofUploadDate = new Date();

      await application.save();
      return application;
    } catch (error) {
      throw error;
    }
  }

  // Upload ID document
  async uploadIdDocument(applicationId, userId, idDocumentUrl, fileName) {
    try {
      const application = await PartnershipApplication.findOne({
        _id: applicationId,
        userId,
      });

      if (!application) {
        throw new Error("Application not found or unauthorized access");
      }

      application.idDocument.idDocumentUrl = idDocumentUrl;
      application.idDocument.fileName = fileName;
      application.idDocument.idDocumentUploadDate = new Date();

      await application.save();
      return application;
    } catch (error) {
      throw error;
    }
  }

  // Change user to partner (admin endpoint)
  async changeUserToPartner(applicationId, userId) {
    try {
      import("../users/user.model.js").then(async (module) => {
        const User = module.default;

        const application =
          await PartnershipApplication.findById(applicationId);

        if (!application) {
          throw new Error("Application not found");
        }

        if (!application.paymentTracking.paymentProofUrl) {
          throw new Error("Payment proof must be uploaded before confirming");
        }

        // Update user as partner
        await User.updateOne({ _id: application.userId }, { isPartner: true });

        // Mark user as converted to partner
        application.paymentTracking.userConvertedToPartner = true;
        await application.save();

        // Send partner welcome email
        try {
          await EmailService.sendPartnerWelcome(
            application.partnerInfo,
            application.referenceId,
          );
        } catch (emailError) {
          console.error(
            "✗ Failed to send partner welcome email:",
            emailError.message,
          );
          // Don't throw - email failure shouldn't break partner conversion
        }

        return application;
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new PartnershipService();
