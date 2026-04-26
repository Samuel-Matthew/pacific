import mongoose from "mongoose";
import ContactInfo from "../../src/modules/contactInfo/contactInfo.model.js";
import dotenv from "dotenv";

dotenv.config();

export const seedContactInfo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB for seeding");

    // Check if contact info already exists
    const existing = await ContactInfo.findOne();
    if (existing) {
      console.log(
        "✓ Contact information already exists, skipping seed (existing data unchanged)",
      );
      process.exit(0);
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
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding error:", error.message);
    process.exit(1);
  }
};

seedContactInfo();
