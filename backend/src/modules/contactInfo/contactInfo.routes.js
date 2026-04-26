import express from "express";
import { getContactInfo, updateContactInfo } from "./contactInfo.controller.js";
import { protect, restrictTo } from "../auth/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/", getContactInfo);

/*
|--------------------------------------------------------------------------
| Protected Routes (Admin Only)
|--------------------------------------------------------------------------
*/

router.put("/", protect, restrictTo("admin"), updateContactInfo);

export default router;
