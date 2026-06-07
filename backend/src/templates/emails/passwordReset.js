import { generateContactHTML } from "./contactHelper.js";

export const passwordResetTemplate = ({ recipientName, resetLink, contactInfo }) => `
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
    .alert-box { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px; color: #856404; }
    .alert-box strong { color: #721c24; }
    .button { background: #d4af37; color: #1a1a1a; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 25px 0; }
    .button:hover { background: #c9a227; }
    .button-container { text-align: center; }
    .copy-section { background: #f8f8f6; padding: 15px; border-radius: 6px; margin: 20px 0; word-break: break-all; font-family: monospace; font-size: 12px; }
    .copy-label { color: #666; font-size: 12px; font-weight: bold; margin-bottom: 8px; }
    .info-box { background: #f0f7ff; padding: 20px; border-left: 4px solid #0066cc; margin: 20px 0; border-radius: 4px; }
    .info-box h3 { margin: 0 0 15px 0; color: #1a1a1a; }
    .info-box ul { margin: 0; padding-left: 20px; }
    .info-box li { margin: 10px 0; line-height: 1.6; }
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
      <p>Password Reset Request</p>
    </div>

    <div class="content">
      <p>Hi ${recipientName},</p>

      <p>We received a request to reset the password for your Pacific Crown Motors account. If you didn't make this request, you can safely ignore this email.</p>

      <div class="alert-box">
        <strong>⏰ This link expires in 15 minutes</strong><br>
        If you don't reset your password within 15 minutes, you'll need to request a new reset link.
      </div>

      <p>Click the button below to reset your password:</p>

      <div class="button-container">
        <a href="${resetLink}" class="button">Reset Your Password</a>
      </div>

      <p style="text-align: center; color: #666;">
        Or paste this link in your browser if the button above doesn't work:
      </p>

      <div class="copy-section">
        <div class="copy-label">Reset Link:</div>
        ${resetLink}
      </div>

      <div class="info-box">
        <h3>🔒 For Your Security</h3>
        <ul>
          <li>Never share this link with anyone</li>
          <li>Your password reset link is unique to you</li>
          <li>Once reset, your old password will no longer work</li>
          <li>Make sure you're on a secure device when resetting</li>
        </ul>
      </div>

      <div class="contact-section">
        <h4>📞 Need Help?</h4>
        <ul>
          ${generateContactHTML(contactInfo)}
        </ul>
      </div>

      <p>Best regards,<br><strong>Pacific Crown Motors Team</strong></p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Pacific Crown Motors. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
