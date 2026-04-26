import crypto from "crypto";
import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| Generate Access Token (short lived)
|--------------------------------------------------------------------------
*/

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

/*
|--------------------------------------------------------------------------
| Generate Refresh Token (long lived)
|--------------------------------------------------------------------------
*/

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

/*
|--------------------------------------------------------------------------
| Verify Access Token
|--------------------------------------------------------------------------
*/

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

/*
|--------------------------------------------------------------------------
| Verify Refresh Token
|--------------------------------------------------------------------------
*/

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/*
|--------------------------------------------------------------------------
| Hash Token (for DB storage)
|--------------------------------------------------------------------------
*/

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/*
|--------------------------------------------------------------------------
| Calculate Refresh Token Expiry Date
|--------------------------------------------------------------------------
*/

export const getRefreshTokenExpiry = () => {
  const days = 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

/*
|--------------------------------------------------------------------------
| Generate Password Reset Token
|--------------------------------------------------------------------------
*/

export const generatePasswordResetToken = () => {
  // Generate a random 32-character hex string
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

/*
|--------------------------------------------------------------------------
| Get Password Reset Token Expiry (15 minutes)
|--------------------------------------------------------------------------
*/

export const getPasswordResetTokenExpiry = () => {
  const minutes = 15;
  return new Date(Date.now() + minutes * 60 * 1000);
};
