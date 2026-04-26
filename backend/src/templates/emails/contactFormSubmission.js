import { generateContactHTML } from "./contactHelper.js";

export const contactFormSubmissionTemplate = ({
  recipientName,
  firstName,
  email,
  phone,
  inquiryType,
  message,
  contactInfo = {},
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px 20px; }
    .content p { margin: 15px 0; line-height: 1.6; }
    .info-box { background: #f8f8f6; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; border-radius: 4px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .info-row:last-child { border-bottom: none; }
    .info-row strong { color: #1a1a1a; min-width: 120px; }
    .message-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .message-box h3 { margin: 0 0 15px 0; color: #92400e; font-size: 16px; }
    .message-content { background: white; padding: 15px; border-radius: 4px; border: 1px solid #fed7aa; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
    .badge { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>New Contact Form Submission</p>
    </div>

    <div class="content">
      <p>Hello ${recipientName},</p>

      <p>You have received a new inquiry from a customer through your website's contact form. Here are the details:</p>

      <div class="info-box">
        <h3>📋 Customer Information</h3>
        <div class="info-row">
          <strong>Name:</strong>
          <span>${firstName}</span>
        </div>
        <div class="info-row">
          <strong>Email:</strong>
          <span><a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a></span>
        </div>
        ${
          phone
            ? `<div class="info-row">
          <strong>Phone:</strong>
          <span><a href="tel:${phone}" style="color: #d4af37; text-decoration: none;">${phone}</a></span>
        </div>`
            : ""
        }
        <div class="info-row">
          <strong>Inquiry Type:</strong>
          <span><span class="badge">${inquiryType.replace(/_/g, " ").toUpperCase()}</span></span>
        </div>
      </div>

      <div class="message-box">
        <h3>💬 Message</h3>
        <div class="message-content">${message}</div>
      </div>

      <p><strong>⚠️ Action Required:</strong> Please respond to this customer inquiry as soon as possible to ensure excellent customer service.</p>

      <p style="margin-top: 30px; color: #999; font-size: 13px;">
        This email was automatically generated from your website's contact form. Please do not reply to this email; instead, contact the customer directly using the information provided above.
      </p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Pacific Crown Motors. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const contactFormConfirmationTemplate = ({
  recipientName,
  inquiryType,
  contactInfo = {},
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
    .content { padding: 30px 20px; }
    .content p { margin: 15px 0; line-height: 1.6; }
    .success-box { background: #ecfdf5; border: 1px solid #6ee7b7; padding: 20px; border-radius: 6px; text-align: center; }
    .success-box h2 { margin: 0; color: #047857; font-size: 24px; }
    .success-box p { margin: 10px 0 0 0; color: #065f46; }
    .info-box { background: #f8f8f6; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin: 0 0 15px 0; color: #1a1a1a; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>Message Received</p>
    </div>

    <div class="content">
      <p>Hello ${recipientName},</p>

      <div class="success-box">
        <h2>✓ Thank You!</h2>
        <p>We've received your inquiry and will get back to you shortly.</p>
      </div>

      <p>We appreciate you reaching out to Pacific Crown Motors. Our team has received your ${inquiryType.replace(/_/g, " ").toLowerCase()} inquiry and will review it carefully.</p>

      <div class="info-box">
        <h3>📌 What Happens Next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Our team will review your inquiry within 24 hours</li>
          <li>You'll receive a response via email or phone</li>
          <li>If you prefer to discuss urgently, feel free to call or use WhatsApp</li>
        </ul>
      </div>

      <p><strong>Need immediate assistance?</strong> Contact us directly:</p>
      <ul style="margin: 15px 0; padding-left: 20px;">
        ${generateContactHTML(contactInfo)}
      </ul>

      <p>Best regards,<br><strong>Pacific Crown Motors Team</strong></p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Pacific Crown Motors. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
