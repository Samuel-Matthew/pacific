import mongoose from "mongoose";

const partnershipApplicationSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Partner Information (from form)
    partnerInfo: {
      fullLegalName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      homeAddress: {
        type: String,
        required: true,
      },
      incomeSource: {
        type: String,
        required: true,
      },
      annualIncome: {
        type: String,
        required: true,
      },
      idType: {
        type: String,
        enum: ["drivers_license", "green_card", "passport"],
        required: true,
      },
      agreementDate: {
        type: Date,
        required: true,
      },
      printedName: {
        type: String,
        required: true,
      },
    },

    // Investment Details
    investmentAmount: {
      type: Number,
      required: true,
      min: 55000,
      max: 500000,
    },

    // Payment Method for receiving returns (optional - user provides via Request Account Details)
    paymentMethod: {
      type: String,
      enum: ["wire_transfer", "wire_check", "ach_payment"],
      default: null,
    },

    // Bank Details (for receiving returns - optional - user provides via Request Account Details)
    bankDetails: {
      accountHolderName: {
        type: String,
        default: null,
      },
      accountNumber: {
        type: String,
        default: null,
      },
      routingNumber: {
        type: String,
        default: null,
      },
      bankName: {
        type: String,
        default: null,
      },
      accountType: {
        type: String,
        default: null,
      },
      swiftCode: {
        type: String,
        default: null,
      },
      mailingAddress: {
        type: String,
        default: null,
      },
    },

    // Signature (base64)
    signature: {
      type: String,
      required: true,
    },

    // ID Document (uploaded to Cloudinary during application)
    idDocument: {
      idDocumentUrl: {
        type: String,
        default: null,
      },
      fileName: {
        type: String,
        default: null,
      },
      idDocumentUploadDate: {
        type: Date,
        default: null,
      },
    },

    // Projected Returns
    projectedAnnualReturn: {
      type: Number,
      default: 0,
    },
    totalValueAfterYear: {
      type: Number,
      default: 0,
    },

    // Application Status
    applicationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Payment Tracking (Investment Payment)
    paymentTracking: {
      status: {
        type: String,
        enum: ["awaiting", "payment_requested", "received"],
        default: "awaiting",
      },
      amountDue: {
        type: Number,
        required: true,
      },
      requestedPaymentMethod: {
        type: String,
        enum: ["wire_transfer", "wire_check", "ach_payment"],
        default: null,
      },
      paymentInstructions: {
        type: String,
        default: "",
      },
      paymentReceivedDate: {
        type: Date,
      },
      paymentProofUrl: {
        type: String,
        default: null,
      },
      paymentProofUploadDate: {
        type: Date,
        default: null,
      },
      userConvertedToPartner: {
        type: Boolean,
        default: false,
      },
    },

    // Admin Notes
    adminNotes: {
      type: String,
      default: "",
    },
    rejectionReason: {
      type: String,
      default: "",
    },

    // Agreement Version
    agreementVersion: {
      type: String,
      default: "2001",
    },

    // Reference ID for tracking
    referenceId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to generate reference ID and calculate returns
partnershipApplicationSchema.pre("save", function () {
  if (!this.referenceId) {
    // Generate format: PCM-YYYYMMDD-XXXXX (e.g., PCM-20260413-12345)
    const date = new Date();
    const dateStr = date.toISOString().split("T")[0].replace(/-/g, "");
    const random = Math.floor(Math.random() * 100000);
    this.referenceId = `PCM-${dateStr}-${random}`;
  }

  // Calculate projected returns (15% quarterly = 60% annually)
  if (this.investmentAmount && !this.projectedAnnualReturn) {
    this.projectedAnnualReturn = this.investmentAmount * 0.6;
    this.totalValueAfterYear =
      this.investmentAmount + this.projectedAnnualReturn;
  }

  // Ensure amountDue matches investmentAmount
  if (this.paymentTracking && this.investmentAmount) {
    this.paymentTracking.amountDue = this.investmentAmount;
  }
});

// Index for faster queries (referenceId already indexed via unique constraint)
partnershipApplicationSchema.index({ userId: 1 });
partnershipApplicationSchema.index({ applicationStatus: 1 });
partnershipApplicationSchema.index({ "paymentTracking.status": 1 });

export default mongoose.model(
  "PartnershipApplication",
  partnershipApplicationSchema,
);
