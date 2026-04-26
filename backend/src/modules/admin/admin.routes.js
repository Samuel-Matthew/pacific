import express from "express";
import {
  getStats,
  listUsers,
  updateRole,
  updateStatus,
  removeUser,
} from "./admin.controller.js";
import { protect } from "../auth/auth.middleware.js";
import { requireAdmin } from "./admin.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Protected Admin Routes
|--------------------------------------------------------------------------
*/

// All admin routes require authentication and admin role
router.use(protect, requireAdmin);

// Statistics
router.get("/stats", getStats);

// Users management
router.get("/users", listUsers);
router.patch("/users/:userId/role", updateRole);
router.patch("/users/:userId/status", updateStatus);
router.delete("/users/:userId", removeUser);

// Partnerships - placeholder for later
// router.get("/partnerships", listPartnerships);
// router.patch("/partnerships/:id/status", updatePartnershipStatus);

export default router;
