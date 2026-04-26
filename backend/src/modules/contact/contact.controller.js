import EmailService from "../../services/emailService.js";

export const submitContactForm = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, inquiry_type, message } =
      req.body;

    // Validation
    if (!first_name || !email || !inquiry_type || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 500 characters",
      });
    }

    // Send confirmation email to customer
    await EmailService.sendContactFormConfirmation({
      recipientEmail: email,
      recipientName: first_name,
      inquiryType: inquiry_type,
    });

    // Send notification email to admin
    await EmailService.sendContactFormSubmission({
      firstName: first_name,
      lastName: last_name,
      email,
      phone: phone || null,
      inquiryType: inquiry_type,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Thank you for your inquiry. We will respond shortly.",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    next(error);
  }
};
