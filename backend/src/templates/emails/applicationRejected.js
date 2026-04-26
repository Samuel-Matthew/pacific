import { generateContactHTML } from "./contactHelper.js";

export const applicationRejectedTemplate = ({
  recipientName,
  referenceId,
  rejectionReason,
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
    .info-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin: 0 0 15px 0; color: #991b1b; }
    .reason-box { background: white; border: 1px solid #fca5a5; padding: 15px; border-radius: 4px; font-style: italic; color: #7f1d1d; }
    .next-steps { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .next-steps h3 { margin: 0 0 15px 0; color: #15803d; }
    .next-steps ul { margin: 0; padding-left: 20px; }
    .next-steps li { margin: 10px 0; line-height: 1.6; }
    .button { background: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>Partnership Application Decision</p>
    </div>

    <div class="content">
      <p>Dear ${recipientName},</p>

      <p>Thank you for your interest in becoming a partner with Pacific Crown Motors. We've carefully reviewed your application, and we regret to inform you that we're unable to move forward at this time.</p>

      <div class="info-box">
        <h3>📋 Application Reference</h3>
        <p><strong>Reference ID:</strong> ${referenceId}</p>
        <p><strong>Status:</strong> Not Approved</p>
      </div>

      <div class="info-box">
        <h3>Reason for Decision</h3>
        <div class="reason-box">${rejectionReason}</div>
      </div>

      <div class="next-steps">
        <h3>🔄 What's Next?</h3>
        <ul>
          <li>You may reapply in the future with updated information</li>
          <li>Feel free to contact us to discuss the decision in more detail</li>
          <li>We encourage you to connect with us through WhatsApp or Signal</li>
          <li>Keep an eye on our website for other partnership opportunities</li>
        </ul>
      </div>

      <p>If you'd like to discuss this decision or have questions, please reach out to our team:</p>
      <ul>
        ${generateContactHTML(contactInfo)}
      </ul>

      <p>We appreciate your interest in Pacific Crown Motors and wish you all the best!</p>
      <p>Best regards,<br><strong>Pacific Crown Motors Partnership Team</strong></p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Pacific Crown Motors. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
