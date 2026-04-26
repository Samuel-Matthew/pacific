import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../../src/config/db.js";
import { seedContactInfo } from "./contactInfo.seeder.js";
import { seedAdmin } from "./adminInfo.js";

dotenv.config();

try {
  await connectDB();
  console.log("✓ Connected to MongoDB");
  console.log("");

  await seedContactInfo();
  console.log("");

  await seedAdmin();
  console.log("");

  console.log("✅ All seeders completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("❌ Seeding error:", error.message);
  process.exit(1);
}
