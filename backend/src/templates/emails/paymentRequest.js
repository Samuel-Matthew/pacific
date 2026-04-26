import { generateContactHTML } from "./contactHelper.js";

export const paymentRequestTemplate = ({
  recipientName,
  referenceId,
  investmentAmount,
  paymentInstructions,
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
    .amount-box { background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%); color: #1a1a1a; padding: 25px; text-align: center; border-radius: 6px; margin: 20px 0; }
    .amount-box h2 { margin: 0; font-size: 36px; }
    .amount-box p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
    .info-box { background: #f8f8f6; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin: 0 0 15px 0; color: #1a1a1a; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .info-row:last-child { border-bottom: none; }
    .payment-details { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 6px; }
    .payment-details h3 { margin: 0 0 15px 0; color: #92400e; }
    .payment-info { background: white; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; border: 1px solid #fed7aa; }
    .button { background: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>Payment Instructions</p>
    </div>

    <div class="content">
      <p>Dear ${recipientName},</p>

      <p>Your partnership application has been approved! To complete your onboarding, please proceed with the payment using the instructions below.</p>

      <div class="amount-box">
        <p>Investment Amount</p>
        <h2>$${investmentAmount ? new Intl.NumberFormat("en-US").format(investmentAmount) : "N/A"}</h2>
      </div>

      <div class="info-box">
        <h3>📋 Partnership Details</h3>
        <div class="info-row">
          <span><strong>Reference ID:</strong></span>
          <span>${referenceId}</span>
        </div>
        <div class="info-row">
          <span><strong>Investment Amount:</strong></span>
          <span>$${investmentAmount ? new Intl.NumberFormat("en-US").format(investmentAmount) : "N/A"}</span>
        </div>
      </div>

      <div class="payment-details">
        <h3>💳 Payment Instructions</h3>
        <div class="payment-info">${paymentInstructions}</div>
      </div>

      <p><strong>⚠️ Important:</strong> Please include your Reference ID (<strong>${referenceId}</strong>) in the payment memo/description. This helps us identify and process your payment quickly.</p>

      <p><strong>After Payment:</strong></p>
      <ul>
        <li>Upload your payment proof to your dashboard</li>
        <li>Our team will verify and confirm your partnership</li>
        <li>You'll receive a welcome confirmation email</li>
      </ul>

      <p style="text-align: center;">
        <a href="${frontendUrl}/partnerships/dashboard" class="button">Upload Payment Proof</a>
      </p>

      <p>If you have any questions about the payment process, please contact us:</p>
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
