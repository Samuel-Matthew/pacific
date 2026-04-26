import apiClient from "./config";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      role?: string;
      status?: string;
    };
    accessToken: string;
  };
  message: string;
}

/**
 * Register a new user
 */
export const signupUser = async (
  payload: SignupPayload,
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload,
    );
    const { accessToken } = response.data.data || {};

    // Store access token in sessionStorage
    // Refresh token is stored as HTTP-Only cookie by backend (more secure)
    if (accessToken) {
      sessionStorage.setItem("pc_access_token", accessToken);
    }
    // Don't store refreshToken in sessionStorage - it comes via HTTP-Only cookie

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Signup failed";
    throw new Error(message);
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    const { accessToken } = response.data.data || {};

    // Store access token in localStorage
    // Refresh token is stored as HTTP-Only cookie by backend (more secure)
    if (accessToken) {
      localStorage.setItem("pc_access_token", accessToken);
    }

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

/**
 * Login user with Google OAuth
 */
export const loginWithGoogle = async (googleToken: string) => {
  try {
    const response = await apiClient.post("/auth/google", {
      token: googleToken,
    });
    const { accessToken } = response.data.data || {};

    // Store access token in localStorage
    // Refresh token is stored as HTTP-Only cookie by backend (more secure)
    if (accessToken) {
      localStorage.setItem("pc_access_token", accessToken);
    }

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Google login failed";
    throw new Error(message);
  }
};

/**
 * Refresh the access token
 * Refresh token is sent automatically via HTTP-Only cookie
 */
export const refreshAccessToken = async () => {
  try {
    const response = await apiClient.post("/auth/refresh");
    const { accessToken } = response.data.data || {};

    if (accessToken) {
      sessionStorage.setItem("pc_access_token", accessToken);
    }

    return response.data;
  } catch (error: any) {
    sessionStorage.removeItem("pc_access_token");
    throw error;
  }
};

/**
 * Logout current session
 * Backend clears HTTP-Only refresh token cookie
 */
export const logoutUser = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear access token from sessionStorage
    // HTTP-Only refresh cookie is cleared by backend
    sessionStorage.removeItem("pc_access_token");
    sessionStorage.removeItem("pc_current_user");
  }
};

/**
 * Logout from all sessions
 * Backend clears all HTTP-Only refresh token cookies
 */
export const logoutAllSessions = async () => {
  try {
    await apiClient.post("/auth/logout-all");
  } catch (error) {
    console.error("Logout all error:", error);
  } finally {
    // Clear access token from sessionStorage
    // HTTP-Only refresh cookies are cleared by backend
    sessionStorage.removeItem("pc_access_token");
    sessionStorage.removeItem("pc_current_user");
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile",
    );
  }
};

/**
 * Upload user avatar/profile image
 */
export const uploadProfileImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await apiClient.put("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Upload failed";
    throw new Error(message);
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async () => {
  try {
    await apiClient.delete("/users/me");
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete account",
    );
  } finally {
    // Clear access token from sessionStorage
    // HTTP-Only refresh cookie is cleared by backend
    sessionStorage.removeItem("pc_access_token");
    sessionStorage.removeItem("pc_current_user");
  }
};

/**
 * Request password reset link via email
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send reset link";
    throw new Error(message);
  }
};

/**
 * Reset password with token and new password
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
) => {
  try {
    const response = await apiClient.post("/auth/reset-password", {
      token,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to reset password";
    throw new Error(message);
  }
};
