import { generateContactHTML } from "./contactHelper.js";

export const paymentReceivedTemplate = ({
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
    .success-badge { background: #ecfdf5; border: 2px solid #10b981; color: #059669; padding: 20px; text-align: center; border-radius: 6px; font-weight: bold; font-size: 18px; margin: 20px 0; }
    .amount-box { background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); color: #1a1a1a; padding: 25px; text-align: center; border-radius: 6px; margin: 20px 0; }
    .amount-box p { margin: 0 0 10px 0; font-size: 14px; }
    .amount-box h2 { margin: 0; font-size: 36px; font-weight: bold; }
    .info-box { background: #f8f8f6; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin: 0 0 15px 0; color: #1a1a1a; }
    .info-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .info-row:last-child { border-bottom: none; }
    .info-row strong { display: block; color: #666; margin-bottom: 5px; }
    .benefits { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .benefits h3 { margin: 0 0 15px 0; color: #15803d; }
    .benefits ul { margin: 0; padding-left: 20px; }
    .benefits li { margin: 10px 0; line-height: 1.6; }
    .button { background: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>Payment Confirmed! Welcome to Our Partner Network</p>
    </div>

    <div class="content">
      <p>Dear ${recipientName},</p>

      <div class="success-badge">✓ Your payment has been successfully received and verified!</div>

      <p>Welcome to the Pacific Crown Motors partnership network! We're excited to have you on board. Your investment is now active and your partnership has been officially established.</p>

      <div class="amount-box">
        <p>Investment Confirmed</p>
        <h2>$${investmentAmount ? new Intl.NumberFormat("en-US").format(investmentAmount) : "N/A"}</h2>
      </div>

      <div class="info-box">
        <h3>📋 Partnership Details</h3>
        <div class="info-row">
          <strong>Reference ID:</strong>
          ${referenceId}
        </div>
        <div class="info-row">
          <strong>Investment Amount:</strong>
          $${investmentAmount ? new Intl.NumberFormat("en-US").format(investmentAmount) : "N/A"}
        </div>
        <div class="info-row">
          <strong>Status:</strong>
          Active Partner ✓
        </div>
        <div class="info-row">
          <strong>Expected Annual Return:</strong>
          $${new Intl.NumberFormat("en-US").format(investmentAmount * 0.6)}
        </div>
      </div>

      <div class="benefits">
        <h3>🎁 Your Partnership Benefits</h3>
        <ul>
          <li><strong>Quarterly Returns:</strong> 15% return per quarter on your investment</li>
          <li><strong>Full Transparency:</strong> Access to quarterly performance reports</li>
          <li><strong>Dedicated Support:</strong> Personal account manager for your partnership</li>
          <li><strong>Exclusive Updates:</strong> Early access to company announcements and opportunities</li>
          <li><strong>Network Access:</strong> Connect with other elite partners</li>
        </ul>
      </div>

      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Access your partnership dashboard to view real-time performance</li>
        <li>Review your first quarterly report (comes in 3 months)</li>
        <li>Expect your first return payment 30 days after the initial import cycle</li>
        <li>Keep your Reference ID safe for future communications</li>
      </ul>

      <p style="text-align: center;">
        <a href="${frontendUrl}/partnerships/dashboard" class="button">Go to Dashboard</a>
      </p>

      <p>Thank you for your partnership! If you have any questions, our team is here to help:</p>
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
