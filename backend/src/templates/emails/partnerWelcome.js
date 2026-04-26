import { generateContactHTML } from "./contactHelper.js";

export const partnerWelcomeTemplate = ({
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
    .welcome-message { background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 2px solid #10b981; color: #059669; padding: 25px; text-align: center; border-radius: 6px; margin: 20px 0; font-size: 16px; font-weight: bold; }
    .section { margin: 25px 0; }
    .section h3 { color: #1a1a1a; margin-bottom: 15px; border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
    .highlights { background: #f8f8f6; padding: 20px; border-radius: 6px; margin: 15px 0; }
    .highlight-item { display: flex; gap: 15px; margin: 15px 0; }
    .highlight-icon { font-size: 24px; flex-shrink: 0; }
    .highlight-content h4 { margin: 0 0 5px 0; color: #1a1a1a; }
    .highlight-content p { margin: 0; color: #666; font-size: 14px; }
    .timeline { margin-top: 20px; }
    .timeline-item { padding-left: 30px; margin: 15px 0; position: relative; }
    .timeline-item:before { content: "✓"; position: absolute; left: 0; top: 0; color: #10b981; font-weight: bold; font-size: 18px; }
    .timeline-item strong { display: block; color: #1a1a1a; }
    .timeline-item span { color: #666; font-size: 14px; }
    .info-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .button { background: #d4af37; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #c9a227; }
    .contact { background: #f8f8f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .contact h4 { margin: 0 0 15px 0; color: #1a1a1a; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pacific Crown Motors</h1>
      <p>Welcome to Our Partnership Network!</p>
    </div>

    <div class="content">
      <p>Dear ${recipientName},</p>

      <div class="welcome-message">
        🌟 Welcome to the Pacific Crown Motors Exclusive Partnership Network! 🌟
      </div>

      <p>We are thrilled to officially welcome you as a valued partner! Your $${new Intl.NumberFormat("en-US").format(investmentAmount)} investment marks the beginning of a mutually beneficial partnership. This is an exciting milestone, and we're committed to delivering exceptional returns and transparency.</p>

      <div class="section">
        <h3>Your Partnership Highlights</h3>
        <div class="highlights">
          <div class="highlight-item">
            <div class="highlight-icon">💰</div>
            <div class="highlight-content">
              <h4>Strong Returns</h4>
              <p>15% quarterly returns (60% annually) on your investment</p>
            </div>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">📊</div>
            <div class="highlight-content">
              <h4>Full Transparency</h4>
              <p>Quarterly performance reports with detailed breakdowns</p>
            </div>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">👥</div>
            <div class="highlight-content">
              <h4>Dedicated Support</h4>
              <p>Personal account manager assigned to your partnership</p>
            </div>
          </div>
          <div class="highlight-item">
            <div class="highlight-icon">🚀</div>
            <div class="highlight-content">
              <h4>Growth Potential</h4>
              <p>Opportunities to increase your investment and earn more</p>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>What to Expect</h3>
        <div class="timeline">
          <div class="timeline-item">
            <strong>Month 1-2:</strong>
            <span>Initial onboarding and vehicle acquisition phase begins</span>
          </div>
          <div class="timeline-item">
            <strong>Month 2-3:</strong>
            <span>Vehicles imported and cleared through customs</span>
          </div>
          <div class="timeline-item">
            <strong>Month 3-4:</strong>
            <span>Retail sales begin; first return calculated</span>
          </div>
          <div class="timeline-item">
            <strong>Month 4+:</strong>
            <span>Quarterly returns paid directly to your account</span>
          </div>
        </div>
      </div>

      <div class="info-box">
        <h3>📋 Your Partnership Details</h3>
        <p><strong>Reference ID:</strong> ${referenceId}</p>
        <p><strong>Investment Amount:</strong> $${new Intl.NumberFormat("en-US").format(investmentAmount)}</p>
        <p><strong>Status:</strong> Active & Confirmed ✓</p>
        <p><strong>Projected First Return:</strong> $${new Intl.NumberFormat("en-US").format(investmentAmount * 0.15)} (in 3-4 months)</p>
      </div>

      <div class="section">
        <h3>Getting Started</h3>
        <ol>
          <li><strong>Access Your Dashboard:</strong> Log in to view your partnership details and performance metrics</li>
          <li><strong>Review Documents:</strong> Download your partnership agreement and terms</li>
          <li><strong>Set Payment Preferences:</strong> Choose how you'd like to receive your quarterly returns</li>
          <li><strong>Stay Updated:</strong> Check your dashboard regularly for quarterly reports</li>
        </ol>
      </div>

      <p style="text-align: center;">
        <a href="${frontendUrl}/partnerships/dashboard" class="button">Access Your Dashboard</a>
      </p>

      <div class="contact">
        <h4>Need Anything? We're Here to Help!</h4>
        <p>Your dedicated account manager and our support team are ready to assist you with any questions or concerns:</p>
        <ul>
          ${generateContactHTML(contactInfo)}
        </ul>
      </div>

      <p>Thank you for choosing Pacific Crown Motors. We're excited about this partnership and look forward to delivering exceptional results!</p>
      <p>Warm regards,<br><strong>The Pacific Crown Motors Partnership Team</strong></p>
    </div>

    <div class="footer">
      <p>&copy; 2026 Pacific Crown Motors. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
