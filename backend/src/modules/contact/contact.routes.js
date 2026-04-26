import express from "express";
import { submitContactForm } from "./contact.controller.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/submit", authLimiter, submitContactForm);

export default router;
