import { generateContactHTML } from "./contactHelper.js";

export const applicationApprovedTemplate = ({
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
    .success-badge { background: #ecfdf5; border: 2px solid #10b981; color: #059669; padding: 15px; text-align: center; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .info-box { background: #f8f8f6; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin: 0 0 15px 0; color: #1a1a1a; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: bold; color: #666; }
    .info-value { color: #1a1a1a; font-weight: 600; }
    .next-steps { background: #f0f9ff; border: 1px solid #0284c7; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .next-steps h3 { margin: 0 0 15px 0; color: #0c4a6e; }
    .next-steps ol { margin: 0; padding-left: 20px; }
    .next-steps li { margin: 10px 0; color: #0c4a6e; }
    .button { background: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #c9a227; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>Partnership Application Approved ✓</p>
    </div>

    <div class="content">
      <p>Dear ${recipientName},</p>

      <div class="success-badge">🎉 Congratulations! Your partnership application has been approved!</div>

      <p>We're thrilled to welcome you to the Pacific Crown Motors partnership network. Your application has been carefully reviewed and approved.</p>

      <div class="info-box">
        <h3>📋 Application Details</h3>
        <div class="info-row">
          <span class="info-label">Reference ID:</span>
          <span class="info-value">${referenceId}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Investment Amount:</span>
          <span class="info-value">$${investmentAmount ? Number(investmentAmount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "N/A"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value">Approved ✓</span>
        </div>
      </div>

      <div class="next-steps">
        <h3>📝 Next Steps</h3>
        <ol>
          <li>Log in to your dashboard</li>
          <li>Navigate to the "Payment Details" section</li>
          <li>Provide your preferred payment method</li>
          <li>Receive payment instructions and complete the transaction</li>
          <li>Become a fully activated partner!</li>
        </ol>
      </div>

      <p style="text-align: center;">
        <a href="${frontendUrl}/partnerships/dashboard" class="button">Go to Dashboard</a>
      </p>

      <p>If you have any questions about the payment process, please don't hesitate to contact us:</p>
      <ul>
        ${generateContactHTML(contactInfo)}
      </ul>

      <p>Best regards,<br><strong>Pacific Crown Motors Partnership Team</strong></p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Pacific Crown Motors. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
