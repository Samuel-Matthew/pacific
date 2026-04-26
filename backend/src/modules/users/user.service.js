import User from "./user.model.js";
import cloudinary from "../../config/cloudinary.js";

/**
 * Upload profile image to Cloudinary
 */
export async function uploadProfileImage(userId, fileBuffer, fileName) {
  if (!fileBuffer) {
    throw Object.assign(new Error("No file provided"), { statusCode: 400 });
  }

  try {
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "pacific_crowns/profiles",
          public_id: `profile_${userId}`,
          resource_type: "auto",
          overwrite: true,
          quality: "auto",
          fetch_format: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      uploadStream.end(fileBuffer);
    });

    // Update user with image URL
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true },
    ).select("-password -resetPasswordToken -resetPasswordExpiry");

    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    return {
      avatar: result.secure_url,
      imageUrl: result.secure_url,
      user,
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw Object.assign(new Error("Image upload failed"), {
      statusCode: 500,
      originalError: error,
    });
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId, updateData) {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password -resetPasswordToken -resetPasswordExpiry");

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return user;
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId) {
  const user = await User.findById(userId).select(
    "-password -resetPasswordToken -resetPasswordExpiry",
  );
  if (!user)
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user;
}
