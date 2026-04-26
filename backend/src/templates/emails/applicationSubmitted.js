import { generateContactHTML } from "./contactHelper.js";

export const applicationSubmittedTemplate = ({
  recipientName,
  referenceId,
  investmentAmount,
  frontendUrl,
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
    .info-box { background: #f8f8f6; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin: 0 0 15px 0; color: #1a1a1a; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: bold; color: #666; }
    .info-value { color: #1a1a1a; font-weight: 600; }
    .next-steps { margin: 25px 0; }
    .next-steps h3 { color: #1a1a1a; margin-bottom: 15px; }
    .next-steps ul { margin: 0; padding-left: 20px; }
    .next-steps li { margin: 10px 0; line-height: 1.6; }
    .button { background: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #c9a227; }
    .contact-section { background: #f0f0f0; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .contact-section h4 { margin: 0 0 10px 0; color: #1a1a1a; }
    .contact-section ul { margin: 0; padding-left: 20px; }
    .contact-section li { margin: 5px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>Partnership Application Received</p>
    </div>

    <div class="content">
      <p>Dear ${recipientName},</p>

      <p>Thank you for submitting your partnership application to Pacific Crown Motors. We're excited about the opportunity to work with you!</p>

      <div class="info-box">
        <h3>📋 Application Summary</h3>
        <div class="info-row">
          <span class="info-label">Reference ID:</span>
          <span class="info-value">${referenceId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Investment Amount:</span>
          <span class="info-value">$${investmentAmount ? new Intl.NumberFormat("en-US").format(Number(investmentAmount)) : "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value">Under Review</span>
        </div>
      </div>

      <div class="next-steps">
        <h3>✓ What's Next?</h3>
        <ul>
          <li>Our team will review your application within <strong>24-48 hours</strong></li>
          <li>You'll receive an email notification with the decision</li>
          <li>If approved, we'll provide detailed payment instructions</li>
          <li>Save your <strong>Reference ID</strong> for all future inquiries</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${frontendUrl}/partnerships/dashboard" class="button">View Your Dashboard</a>
      </p>

      <div class="contact-section">
        <h4>📞 Questions or Issues?</h4>
        <ul>
          ${generateContactHTML(contactInfo)}
        </ul>
      </div>

      <p>Best regards,<br><strong>Pacific Crown Motors Partnership Team</strong></p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Pacific Crown Motors. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
