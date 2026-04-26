import jwt from "jsonwebtoken";
import User from "../users/user.model.js";

/*
|--------------------------------------------------------------------------
| Protect Routes (Requires Access Token)
|--------------------------------------------------------------------------
*/

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const protect = asyncHandler(async (req, res, next) => {
  try {
    let token;

    // Check Authorization header: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Not authorized, invalid token",
    });
  }
});

/*
|--------------------------------------------------------------------------
| Restrict By Role
|--------------------------------------------------------------------------
*/

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
