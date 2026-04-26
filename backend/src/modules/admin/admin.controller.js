import {
  getAdminStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "./admin.service.js";

/*
|--------------------------------------------------------------------------
| Get Dashboard Statistics
|--------------------------------------------------------------------------
*/

export const getStats = async (req, res, next) => {
  try {
    const stats = await getAdminStats();
    res.json({
      success: true,
      message: "Admin stats retrieved",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Users (with pagination & filtering)
|--------------------------------------------------------------------------
*/

export const listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      search: req.query.search,
      role: req.query.role,
      status: req.query.status,
    };

    const result = await getUsers(page, limit, filters);

    res.json({
      success: true,
      message: "Users retrieved",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update User Role
|--------------------------------------------------------------------------
*/

export const updateRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const user = await updateUserRole(userId, role);

    res.json({
      success: true,
      message: "User role updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update User Status
|--------------------------------------------------------------------------
*/

export const updateStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const user = await updateUserStatus(userId, status);

    res.json({
      success: true,
      message: "User status updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export const removeUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await deleteUser(userId);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};
