/**
 * Generate HTML contact information block with dynamic data
 * @param {Object} contactInfo - Contact information object
 * @returns {string} HTML contact list
 */
export const generateContactHTML = (contactInfo = {}) => {
  const {
    phone = "+1 (683) 205 6826",
    whatsapp = "+1 (683) 205 6826",
    signal = "+1 (307) 629 0128",
    telegram = null,
    email = "pacificcrownautosinfo@gmail.com",
  } = contactInfo;

  let html = "";

  if (phone) {
    html += `<li><strong>Phone:</strong> <a href="tel:${phone.replace(/\D/g, "")}" style="color: #d4af37; text-decoration: none;">${phone}</a></li>`;
  }

  if (whatsapp) {
    html += `<li><strong>WhatsApp:</strong> <a href="https://wa.me/${whatsapp.replace(/\D/g, "")}" style="color: #d4af37; text-decoration: none;">${whatsapp}</a></li>`;
  }

  if (signal) {
    html += `<li><strong>Signal:</strong> <a href="signal://call/${signal.replace(/\D/g, "")}" style="color: #d4af37; text-decoration: none;">${signal}</a></li>`;
  }

  if (telegram) {
    html += `<li><strong>Telegram:</strong> <a href="https://t.me/${telegram.replace(/\D/g, "")}" style="color: #d4af37; text-decoration: none;">${telegram}</a></li>`;
  }

  if (email) {
    html += `<li><strong>Email:</strong> <a href="mailto:${email}" style="color: #d4af37; text-decoration: none;">${email}</a></li>`;
  }

  return html;
};
