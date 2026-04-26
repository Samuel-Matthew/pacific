import brevoClient from "../config/brevo.js";
import {
  applicationSubmittedTemplate,
  applicationApprovedTemplate,
  applicationRejectedTemplate,
  paymentRequestTemplate,
  paymentReceivedTemplate,
  partnerWelcomeTemplate,
} from "../templates/emails/index.js";
import ContactInfo from "../modules/contactInfo/contactInfo.model.js";

const SENDER_EMAIL = process.env.EMAIL_SENDER || "samuelmatthew071@gmail.com";
const SENDER_NAME =
  process.env.EMAIL_SENDER_NAME || "Pacific Crown Motors Partnership";

class EmailService {
  /**
   * Send raw email via Brevo
   * @param {Object} options - Email options
   * @param {string} options.recipientEmail - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.htmlContent - HTML email body
   * @param {string} [options.recipientName] - Recipient name
   */
  static async sendEmail({
    recipientEmail,
    subject,
    htmlContent,
    recipientName = "Partner",
  }) {
    try {
      const response = await brevoClient.post("/smtp/email", {
        sender: {
          name: SENDER_NAME,
          email: SENDER_EMAIL,
        },
        to: [
          {
            email: recipientEmail,
            name: recipientName,
          },
        ],
        subject,
        htmlContent,
      });

      console.log(`✓ Email sent successfully to ${recipientEmail}`);
      return response.data;
    } catch (error) {
      console.error(
        `✗ Failed to send email to ${recipientEmail}:`,
        error.message,
      );
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  /**
   * Get contact info from database or empty object
   */
  static async getContactInfo() {
    try {
      const contact = await ContactInfo.findOne();
      return contact || {};
    } catch (error) {
      console.error("Error fetching contact info:", error);
      return {};
    }
  }

  /**
   * Send application submitted confirmation email
   * @param {Object} partnerInfo - Partner information object
   * @param {string} referenceId - Application reference ID
   * @param {string} applicationId - Application ID
   * @param {number} investmentAmount - Investment amount
   */
  static async sendApplicationSubmitted(
    partnerInfo,
    referenceId,
    applicationId,
    investmentAmount,
  ) {
    const frontendUrl =
      process.env.FRONTEND_URL || "https://pacificcrownmotors.com";
    const contactInfo = await this.getContactInfo();

    const htmlContent = applicationSubmittedTemplate({
      recipientName: partnerInfo.fullLegalName,
      referenceId,
      investmentAmount,
      frontendUrl,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail: partnerInfo.email,
      recipientName: partnerInfo.fullLegalName,
      subject: `Partnership Application Received - Reference ID: ${referenceId}`,
      htmlContent,
    });
  }

  /**
   * Send application approved email
   * @param {Object} partnerInfo - Partner information object
   * @param {string} referenceId - Application reference ID
   * @param {number} investmentAmount - Investment amount
   */
  static async sendApplicationApproved(
    partnerInfo,
    referenceId,
    investmentAmount,
  ) {
    const contactInfo = await this.getContactInfo();
    const frontendUrl =
      process.env.FRONTEND_URL || "https://pacificcrownmotors.com";

    const htmlContent = applicationApprovedTemplate({
      recipientName: partnerInfo.fullLegalName,
      referenceId,
      investmentAmount,
      frontendUrl,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail: partnerInfo.email,
      recipientName: partnerInfo.fullLegalName,
      subject: `Partnership Application Approved - ${referenceId}`,
      htmlContent,
    });
  }

  /**
   * Send application rejected email
   * @param {Object} partnerInfo - Partner information object
   * @param {string} referenceId - Application reference ID
   * @param {string} rejectionReason - Reason for rejection
   */
  static async sendApplicationRejected(
    partnerInfo,
    referenceId,
    rejectionReason,
  ) {
    const contactInfo = await this.getContactInfo();

    const htmlContent = applicationRejectedTemplate({
      recipientName: partnerInfo.fullLegalName,
      referenceId,
      rejectionReason,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail: partnerInfo.email,
      recipientName: partnerInfo.fullLegalName,
      subject: `Partnership Application Status Update - ${referenceId}`,
      htmlContent,
    });
  }

  /**
   * Send payment request email
   * @param {Object} partnerInfo - Partner information object
   * @param {string} referenceId - Application reference ID
   * @param {number} investmentAmount - Investment amount
   * @param {string} paymentInstructions - Payment instructions
   */
  static async sendPaymentRequest(
    partnerInfo,
    referenceId,
    investmentAmount,
    paymentInstructions,
  ) {
    const contactInfo = await this.getContactInfo();

    const htmlContent = paymentRequestTemplate({
      recipientName: partnerInfo.fullLegalName,
      referenceId,
      investmentAmount,
      paymentInstructions,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail: partnerInfo.email,
      recipientName: partnerInfo.fullLegalName,
      subject: `Payment Instructions - Partnership ID: ${referenceId}`,
      htmlContent,
    });
  }

  /**
   * Send payment received confirmation email
   * @param {Object} partnerInfo - Partner information object
   * @param {string} referenceId - Application reference ID
   * @param {number} investmentAmount - Investment amount
   */
  static async sendPaymentReceived(partnerInfo, referenceId, investmentAmount) {
    const contactInfo = await this.getContactInfo();

    const htmlContent = paymentReceivedTemplate({
      recipientName: partnerInfo.fullLegalName,
      referenceId,
      investmentAmount,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail: partnerInfo.email,
      recipientName: partnerInfo.fullLegalName,
      subject: `Payment Received - Welcome to Pacific Crown Motors Partnership!`,
      htmlContent,
    });
  }

  /**
   * Send partner welcome email
   * @param {Object} partnerInfo - Partner information object
   * @param {string} referenceId - Application reference ID
   */
  static async sendPartnerWelcome(partnerInfo, referenceId) {
    const contactInfo = await this.getContactInfo();

    const htmlContent = partnerWelcomeTemplate({
      recipientName: partnerInfo.fullLegalName,
      referenceId,
      investmentAmount: partnerInfo.investmentAmount,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail: partnerInfo.email,
      recipientName: partnerInfo.fullLegalName,
      subject: `Welcome to Pacific Crown Motors Partnership Network!`,
      htmlContent,
    });
  }

  /**
   * Send contact form confirmation to customer
   */
  static async sendContactFormConfirmation({
    recipientEmail,
    recipientName,
    inquiryType,
  }) {
    const { contactFormConfirmationTemplate } =
      await import("../templates/emails/contactFormSubmission.js");
    const contactInfo = await this.getContactInfo();

    const htmlContent = contactFormConfirmationTemplate({
      recipientName,
      inquiryType,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail,
      recipientName,
      subject: "We Received Your Inquiry - Pacific Crown Motors",
      htmlContent,
    });
  }

  /**
   * Send contact form submission notification to admin
   */
  static async sendContactFormSubmission({
    firstName,
    lastName,
    email,
    phone,
    inquiryType,
    message,
  }) {
    const { contactFormSubmissionTemplate } =
      await import("../templates/emails/contactFormSubmission.js");
    const contactInfo = await this.getContactInfo();

    const htmlContent = contactFormSubmissionTemplate({
      recipientName: "Pacific Crown Motors Team",
      firstName: `${firstName} ${lastName}`,
      email,
      phone,
      inquiryType,
      message,
      contactInfo,
    });

    return this.sendEmail({
      recipientEmail: process.env.BREVO_SENDER_EMAIL,
      recipientName: "Pacific Crown Motors",
      subject: `New Contact Inquiry: ${inquiryType.replace(/_/g, " ")}`,
      htmlContent,
    });
  }
}

export default EmailService;
