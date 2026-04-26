import express from "express";
import {
  register,
  login,
  googleLogin,
  refreshTokenHandler,
  logout,
  logoutAll,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "../auth/auth.controller.js";

import { protect } from "../auth/auth.middleware.js";
import { loginLimiter } from "../auth/loginLimiter.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post("/register", authLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/google", authLimiter, googleLogin);
router.post("/refresh", refreshTokenHandler);
router.post("/forgot-password", authLimiter, forgotPasswordHandler);
router.post("/reset-password", authLimiter, resetPasswordHandler);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAll);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
