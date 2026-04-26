import User from "../users/user.model.js";

/*
|--------------------------------------------------------------------------
| Get Admin Statistics
|--------------------------------------------------------------------------
*/

export const getAdminStats = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: "active" });
  const newUsersThisMonth = await User.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setDate(1)),
    },
  });

  return {
    totalUsers,
    activeUsers,
    newUsersThisMonth,
    totalPartnerships: 0,
    pendingPartnerships: 0,
    approvedPartnerships: 0,
  };
};

/*
|--------------------------------------------------------------------------
| Get All Users with Pagination & Filtering
|--------------------------------------------------------------------------
*/

export const getUsers = async (page = 1, limit = 10, filters = {}) => {
  const { search, role, status } = filters;

  // Build query
  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const users = await User.find(query)
    .select("-password -resetPasswordToken -resetPasswordExpiry")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count
  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return {
    data: users,
    total,
    page,
    limit,
    totalPages,
  };
};

/*
|--------------------------------------------------------------------------
| Update User Role
|--------------------------------------------------------------------------
*/

export const updateUserRole = async (userId, role) => {
  const validRoles = ["user", "admin", "moderator"];
  if (!validRoles.includes(role)) {
    throw Object.assign(new Error("Invalid role"), { statusCode: 400 });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  ).select("-password -resetPasswordToken -resetPasswordExpiry");

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| Update User Status
|--------------------------------------------------------------------------
*/

export const updateUserStatus = async (userId, status) => {
  const validStatuses = ["active", "suspended", "banned"];
  if (!validStatuses.includes(status)) {
    throw Object.assign(new Error("Invalid status"), { statusCode: 400 });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true },
  ).select("-password -resetPasswordToken -resetPasswordExpiry");

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return user;
};
