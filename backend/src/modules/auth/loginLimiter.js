// middleware/loginLimiter.js

import rateLimit from "../../config/rateLimit.js";

export const loginLimiter = async (req, res, next) => {
  try {
    const identifier = `login:${req.ip}:${req.body.email}`;

    const { success } = await rateLimit.limit(identifier);

    if (!success) {
      return res.status(429).json({
        success: false,
        message: "Too many login attempts. Try again later.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
