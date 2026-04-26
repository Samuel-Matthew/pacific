import rateLimit from "../config/rateLimit.js";
export const authLimiter = async (req, res, next) => {
  try {
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const { success, remaining } = await rateLimit.limit(`auth:${ip}`);

    if (!success) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Try again later.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
