import axios from "axios";

// API Base URL - configure based on environment
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL
    : "/api";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests for session management
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("pc_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle token refresh and global errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token
    // Refresh token is sent automatically via HTTP-Only cookie (withCredentials: true)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {}, // Empty body - refresh token comes via HTTP-Only cookie
          { withCredentials: true }, // Cookie is sent automatically
        );

        const { accessToken } = response.data.data || {};
        if (accessToken) {
          sessionStorage.setItem("pc_access_token", accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        sessionStorage.removeItem("pc_access_token");
        sessionStorage.removeItem("pc_current_user");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 429) {
      error.message = "Too many requests. Please try again later.";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
