import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../src/modules/users/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const seedAdmin = async () => {
  try {
    console.log("📝 Seeding admin account...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(
        "✓ Admin account already exists, skipping seed (existing admin unchanged)",
      );
      console.log("  Admin Email:", existingAdmin.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    // Create default admin user
    const admin = new User({
      name: "Admin User",
      username: "admin",
      email: "sammatt071@gmail.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      isPartner: false,
      provider: "local",
    });

    await admin.save();
    console.log("✓ Admin account seeded successfully");
    console.log("  Name:", admin.name);
    console.log("  Username:", admin.username);
    console.log("  Email:", admin.email);
    console.log("  Role:", admin.role);
    console.log("");
    console.log("⚠️  DEFAULT CREDENTIALS:");
    console.log("  Email: sammatt071@gmail.com");
    console.log("  Password: admin@123");
    console.log("");
    console.log(
      "⚠️  IMPORTANT: Change the default password after first login!",
    );
  } catch (error) {
    console.error("✗ Admin seeding error:", error.message);
    throw error;
  }
};

// Allow running directly with: node adminInfo.js
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");
    await seedAdmin();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
