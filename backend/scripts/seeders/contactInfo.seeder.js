import mongoose from "mongoose";
import ContactInfo from "../../src/modules/contactInfo/contactInfo.model.js";
import dotenv from "dotenv";

dotenv.config();

export const seedContactInfo = async () => {
  try {
    console.log("📝 Seeding contact information...");

    // Check if contact info already exists
    const existing = await ContactInfo.findOne();
    if (existing) {
      console.log(
        "✓ Contact information already exists, skipping seed (existing data unchanged)",
      );
      return;
    }

    // Create default contact info
    const contactInfo = new ContactInfo({
      email: "pacificcrownautosinfo@gmail.com",
      whatsapp: "+1 (683) 205 6826",
      telegram: "+1 (307) 629 0128",
      signal: "+1 (307) 629 0128",
      phone: "+1 (683) 205 6826",
    });

    await contactInfo.save();
    console.log("✓ Contact information seeded successfully");
    console.log("  Email:", contactInfo.email);
    console.log("  WhatsApp:", contactInfo.whatsapp);
    console.log("  Telegram:", contactInfo.telegram);
    console.log("  Signal:", contactInfo.signal);
    console.log("  Phone:", contactInfo.phone);
  } catch (error) {
    console.error("✗ Contact info seeding error:", error.message);
    throw error;
  }
};

// Allow running directly with: node contactInfo.seeder.js
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");
    await seedContactInfo();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
