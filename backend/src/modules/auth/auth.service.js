import User from "../users/user.model.js";
import RefreshToken from "../../models/RefreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshTokenExpiry,
  generatePasswordResetToken,
  getPasswordResetTokenExpiry,
} from "../../services/token.service.js";

/*
|--------------------------------------------------------------------------
| Register User (Local)
|--------------------------------------------------------------------------
*/

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    provider: "local",
  });

  return user;
};

/*
|--------------------------------------------------------------------------
| Login User (Local)
|--------------------------------------------------------------------------
*/

export const loginUser = async ({ email, password, userAgent, ipAddress }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || user.provider !== "local") {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return generateTokensForUser(user, userAgent, ipAddress);
};

/*
|--------------------------------------------------------------------------
| Google Login
|--------------------------------------------------------------------------
*/

export const loginWithGoogle = async ({
  googleId,
  email,
  name,
  userAgent,
  ipAddress,
}) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      provider: "google",
      googleId,
    });
  }

  return generateTokensForUser(user, userAgent, ipAddress);
};

/*
|--------------------------------------------------------------------------
| Generate Tokens & Store Refresh Token
|--------------------------------------------------------------------------
*/

const generateTokensForUser = async (user, userAgent, ipAddress) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const hashedToken = hashToken(refreshToken);

  await RefreshToken.create({
    user: user._id,
    token: hashedToken,
    userAgent,
    ipAddress,
    expiresAt: getRefreshTokenExpiry(),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    },
  };
};

/*
|--------------------------------------------------------------------------
| Refresh Access Token
|--------------------------------------------------------------------------
*/

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("No refresh token provided");
  }

  const decoded = verifyRefreshToken(refreshToken);

  const hashedToken = hashToken(refreshToken);

  const storedToken = await RefreshToken.findOne({
    user: decoded.id,
    token: hashedToken,
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(decoded.id);

  return { accessToken: newAccessToken };
};

/*
|--------------------------------------------------------------------------
| Logout Current Session
|--------------------------------------------------------------------------
*/

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;

  const hashedToken = hashToken(refreshToken);

  await RefreshToken.deleteOne({ token: hashedToken });
};

/*
|--------------------------------------------------------------------------
| Logout All Sessions
|--------------------------------------------------------------------------
*/

export const logoutAllSessions = async (userId) => {
  await RefreshToken.deleteMany({ user: userId });
};

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if email exists (security best practice)
    return { message: "If email exists, reset link will be sent" };
  }

  // Generate reset token
  const resetToken = generatePasswordResetToken();
  const hashedToken = hashToken(resetToken);

  // Save hashed token and expiry to user document
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiry = getPasswordResetTokenExpiry();
  await user.save();

  return {
    message: "Password reset link sent",
    resetToken, // Return unhashed token to send in email
    user,
  };
};

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}) => {
  // Validate passwords match
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // Validate password strength
  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // Hash the token to match against DB
  const hashedToken = hashToken(token);

  // Find user with matching reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: new Date() }, // Token must not be expired
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Update password and clear reset token fields
  user.password = newPassword; // Will be hashed by pre-save hook
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  return { message: "Password reset successfully" };
};
