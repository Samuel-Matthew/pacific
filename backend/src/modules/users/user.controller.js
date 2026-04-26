import {
  updateProfile,
  getUserProfile,
  uploadProfileImage,
} from "./user.service.js";

/**
 * PUT /api/users/profile/avatar
 * Upload and update user profile image
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const result = await uploadProfileImage(
      req.user.id,
      req.file.buffer,
      req.file.originalname,
    );

    res.json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        avatar: result.imageUrl,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Save / update onboarding profile for the authenticated user.
 */
export const saveProfile = async (req, res, next) => {
  try {
    const user = await updateProfile(req.user.id, req.body);
    res.json({
      success: true,
      message: "Profile saved",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/profile
 * Return the authenticated user's full profile.
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.json({
      success: true,
      message: "Profile retrieved",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
