import dotenv from "dotenv";
import {connectDB} from "../../src/config/db.js";
import { seedContactInfo } from "./contactInfo.seeder.js";


dotenv.config();

try {
  await connectDB();

  await seedContactInfo();
 

  console.log("All seeders completed");
  process.exit(0);
} catch (error) {
  console.error("Seeding error:", error);
  process.exit(1);
}
