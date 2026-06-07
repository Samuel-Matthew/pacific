import {
  registerUser,
  loginUser,
  loginWithGoogle,
  refreshAccessToken,
  logoutUser,
  logoutAllSessions,
  forgotPassword,
  resetPassword,
} from "../auth/auth.service.js";
import { refreshCookieOptions } from "../../config/cookies.js";
import EmailService from "../../services/emailService.js";
import { passwordResetTemplate } from "../../templates/emails/passwordReset.js";
/*
|--------------------------------------------------------------------------
| Helper: Set Refresh Token Cookie
|--------------------------------------------------------------------------
*/

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, refreshCookieOptions);
};

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    // Generate tokens for newly registered user
    const {
      accessToken,
      refreshToken,
      user: userData,
    } = await loginUser({
      email: req.body.email,
      password: req.body.password,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userData,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message || error);
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Login (Local)
|--------------------------------------------------------------------------
*/

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await loginUser({
      ...req.body,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    setRefreshCookie(res, refreshToken);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Google Login
|--------------------------------------------------------------------------
*/

export const googleLogin = async (req, res, next) => {
  try {
    const { googleId, email, name } = req.body;

    const { accessToken, refreshToken, user } = await loginWithGoogle({
      googleId,
      email,
      name,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    setRefreshCookie(res, refreshToken);

    res.json({
      success: true,
      message: "Google login successful",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Refresh Access Token
|--------------------------------------------------------------------------
*/

export const refreshTokenHandler = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    const { accessToken } = await refreshAccessToken(token);

    res.json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Logout Current Session
|--------------------------------------------------------------------------
*/

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    await logoutUser(token);

    res.clearCookie("refreshToken", refreshCookieOptions);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Logout All Sessions
|--------------------------------------------------------------------------
*/

export const logoutAll = async (req, res, next) => {
  try {
    await logoutAllSessions(req.user.id);

    res.clearCookie("refreshToken", refreshCookieOptions);

    res.json({
      success: true,
      message: "Logged out from all sessions",
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotPasswordHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("🔐 [FORGOT PASSWORD] Request received for email:", email);

    if (!email) {
      console.warn("⚠️ [FORGOT PASSWORD] Email is required");
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const result = await forgotPassword({ email });

    // If user exists and reset token was generated, send email
    if (result.resetToken) {
      console.log("✅ [FORGOT PASSWORD] Token generated for user:", result.user?.name);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${result.resetToken}`;
      console.log("🔗 [FORGOT PASSWORD] Reset link:", resetLink);
      const contactInfo = await EmailService.getContactInfo();

      const htmlContent = passwordResetTemplate({
        recipientName: result.user.name,
        resetLink,
        contactInfo,
      });

      console.log("📧 [FORGOT PASSWORD] Sending email to:", email);
      await EmailService.sendEmail({
        recipientEmail: email,
        recipientName: result.user.name,
        subject: "Password Reset Request - Pacific Crown Motors Partnership",
        htmlContent,
      });
      console.log("✅ [FORGOT PASSWORD] Email sent successfully to:", email);
    } else {
      console.log("ℹ️ [FORGOT PASSWORD] No user found for email (security: generic response):", email);
    }

    // Always return generic success to prevent email enumeration attacks
    res.json({
      success: true,
      message:
        "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("❌ [FORGOT PASSWORD] Error:", error.message || error);
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetPasswordHandler = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    console.log("🔐 [RESET PASSWORD] Request received");
    console.log("   - Token provided:", !!token ? "Yes (length: " + token.length + ")" : "No");
    console.log("   - Password length:", newPassword?.length || 0);
    console.log("   - Confirm password length:", confirmPassword?.length || 0);

    if (!token || !newPassword || !confirmPassword) {
      console.warn("⚠️ [RESET PASSWORD] Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Token and passwords are required",
      });
    }

    console.log("✅ [RESET PASSWORD] All fields provided, processing reset...");
    await resetPassword({ token, newPassword, confirmPassword });
    console.log("✅ [RESET PASSWORD] Password reset successfully");

    res.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("❌ [RESET PASSWORD] Error:", error.message || error);
    next(error);
  }
};
