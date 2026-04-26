# Frontend API Configuration Guide

This document explains the centralized API configuration setup for the Pacific Crowns frontend.

## Overview

The frontend uses **Axios** for all HTTP requests with a centralized configuration that includes:

- Base URL configuration
- Request/Response interceptors
- Automatic token management
- Error handling

## File Structure

```
src/api/
├── config.ts    # Axios instance and interceptor configuration
└── auth.ts      # Authentication API service functions
```

## Configuration Files

### 1. `src/api/config.ts`

Central axios configuration with:

- **Base URL**: Configurable via `VITE_API_URL` environment variable
- **Request Interceptor**: Automatically adds Authorization header with JWT token
- **Response Interceptor**: Handles 401 errors and token refresh, manages error responses

### 2. `src/api/auth.ts`

Service functions for authentication:

- `signupUser(payload)` - Register new user
- `loginUser(payload)` - Login with email/password
- `loginWithGoogle(token)` - OAuth login
- `refreshAccessToken()` - Refresh JWT token
- `logoutUser()` - Logout current session
- `logoutAllSessions()` - Logout from all devices
- `getCurrentUser()` - Fetch user profile
- `updateUserAvatar(avatarDataUrl)` - Update profile avatar
- `deleteUserAccount()` - Delete user account

## Environment Variables

Create a `.env.local` file in the frontend root:

```env
# API Configuration
VITE_API_URL=http://localhost:5001/api
```

For production:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Usage

### In Components

```tsx
import { useAuth } from "@/context/AuthContext";

export function MyComponent() {
  const { login, logout, user, isLoading } = useAuth();

  const handleLogin = async () => {
    const result = await login("user@example.com", "password");
    if (result.success) {
      console.log("Logged in successfully");
    } else {
      console.error(result.error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
```

### Direct API Calls

```tsx
import * as authAPI from "@/api/auth";

// Call API directly
try {
  const response = await authAPI.loginUser({
    email: "user@example.com",
    password: "password",
  });
  console.log(response.data.user);
} catch (error) {
  console.error(error.message);
}
```

## Token Management

Tokens are managed securely using a hybrid approach:

- **Access Token**: Stored in `localStorage` as `pc_access_token`
- **Refresh Token**: Stored in HTTP-Only cookie (set by backend, cannot be accessed by JavaScript for security)

This approach protects against XSS attacks. When a 401 Unauthorized response is received:

1. System automatically invokes the `/auth/refresh` endpoint
2. The refresh token is sent via HTTP-Only cookie automatically
3. New access token is obtained and stored in localStorage
4. Original request is retried with the new token
5. If refresh fails, user is logged out and redirected to home

## Error Handling

All API errors follow this pattern:

```tsx
try {
  const result = await login(email, password);
  if (!result.success) {
    // Handle specific error
    console.error(result.error);
  }
} catch (error) {
  // Network or unexpected error
  console.error(error.message);
}
```

## Common Error Codes

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Invalid credentials or expired token
- **429 Too Many Requests**: Rate limit exceeded
- **500 Server Error**: Backend error

## CORS Configuration

The frontend automatically sends credentials with requests via:

```typescript
withCredentials: true;
```

Ensure your backend CORS configuration allows this.

## Best Practices

1. **Always use the context** for authentication state
2. **Handle async operations** properly with loading states
3. **Store sensitive data** in localStorage (tokens only, never passwords)
4. **Validate input** before sending to backend
5. **Handle errors gracefully** with user-friendly messages

## Extending the API

To add new API endpoints:

1. Create a new function in `src/api/auth.ts` or a new service file
2. Use the `apiClient` instance from `src/api/config.ts`
3. Handle errors and token management
4. Export the function for use in components

Example:

```typescript
export const updateUserProfile = async (userData: UserProfile) => {
  try {
    const response = await apiClient.put("/users/profile", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Update failed");
  }
};
```

## Troubleshooting

### Tokens not being sent to backend

- Verify `withCredentials: true` is set in config
- Check that token is actually saved in localStorage
- Use browser DevTools to inspect request headers

### CORS errors

- Backend must have correct CORS headers
- Frontend origin must be in backend's allowed origins
- Check `VITE_API_URL` matches your backend

### Infinite refresh loop

- Check refresh token validity on backend
- Ensure refresh endpoint returns new tokens
- Verify token expiration times are properly configured
