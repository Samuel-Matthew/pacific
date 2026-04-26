import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import { authLimiter } from "./middlewares/rateLimiter.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import partnershipRoutes from "./modules/partnerships/partnership.routes.js";
import contactInfoRoutes from "./modules/contactInfo/contactInfo.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT;

// CORS middleware - enable for both dev and production
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5001",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(authLimiter);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/partnerships", partnershipRoutes);
app.use("/api/contact-info", contactInfoRoutes);
app.use("/api/contact", contactRoutes);

// Serve static frontend files
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
  // Don't fallback for API errors, only for SPA routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "Route not found" });
  }
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);

  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: error.stack }),
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
