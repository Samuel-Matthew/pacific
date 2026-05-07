import { createContext, useState, useEffect, type ReactNode } from "react";
import * as authAPI from "@/api/auth";

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  status?: string;
  isPartner?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isInitialized: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  deleteAccount: () => Promise<void>;
  showLogin: boolean;
  showSignup: boolean;
  showForgotPassword: boolean;
  openLogin: () => void;
  openSignup: () => void;
  openForgotPassword: () => void;
  closeModals: () => void;
  closeForgotPassword: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const CURRENT_KEY = "pc_current_user";

function sendWelcomeEmail(name: string, email: string) {
  // Simulate sending a welcome email via mailto (opens email client)
  // In production, replace with EmailJS or a backend API call
  // const subject = encodeURIComponent("Welcome to Pacific Crowns — Your Account is Ready!");
  // const body = encodeURIComponent(...);
  // window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

  // Store a flag so we can show an in-app welcome notification
  sessionStorage.setItem("pc_welcome_shown", "false");
  sessionStorage.setItem("pc_welcome_name", name);
  sessionStorage.setItem("pc_welcome_email", email);
  // Silently log — in production this would be an API call
  console.info(`[Pacific Crowns] Welcome email queued for: ${email}`);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Restore user from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(CURRENT_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem(CURRENT_KEY);
      }
    }
    setIsInitialized(true);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await authAPI.loginUser({ email, password });

      if (response.data?.user) {
        const userData: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          role: response.data.user.role,
          status: response.data.user.status,
        };
        sessionStorage.setItem(CURRENT_KEY, JSON.stringify(userData));
        setUser(userData);
        setShowLogin(false);

        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (error: any) {
      const errorMessage =
        error.message || error.response?.data?.message || "Login failed";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await authAPI.signupUser({ name, email, password });

      if (response.data?.user) {
        const userData: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          role: response.data.user.role,
          status: response.data.user.status,
        };
        sessionStorage.setItem(CURRENT_KEY, JSON.stringify(userData));
        setUser(userData);
        setShowSignup(false);
        sendWelcomeEmail(name, email);

        return { success: true };
      }
      return { success: false, error: "Signup failed" };
    } catch (error: any) {
      const errorMessage =
        error.message || error.response?.data?.message || "Signup failed";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (file: File): Promise<void> => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await authAPI.uploadProfileImage(file);

      // response.data has nested data structure with user object
      if (response.data?.user?.avatar || response.data?.avatar) {
        const avatarUrl = response.data.user?.avatar || response.data.avatar;
        const updated = { ...user, avatar: avatarUrl };
        sessionStorage.setItem(CURRENT_KEY, JSON.stringify(updated));
        setUser(updated);
      }
    } catch (error: any) {
      console.error("Failed to update avatar:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!user) return;
    try {
      setIsLoading(true);
      await authAPI.deleteUserAccount();
      setUser(null);
    } catch (error: any) {
      console.error("Failed to delete account:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authAPI.logoutUser();
    } catch (error: any) {
      console.error("Logout error:", error.message);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const openLogin = () => {
    setShowSignup(false);
    setShowForgotPassword(false);
    setShowLogin(true);
  };
  const openSignup = () => {
    setShowLogin(false);
    setShowForgotPassword(false);
    setShowSignup(true);
  };
  const openForgotPassword = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgotPassword(true);
  };
  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgotPassword(false);
  };
  const closeForgotPassword = () => {
    setShowForgotPassword(false);
  };

  // Helper function to update user and persist to sessionStorage
  const updateUserState = (newUser: User | null) => {
    if (newUser) {
      sessionStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem(CURRENT_KEY);
    }
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: updateUserState,
        isInitialized,
        login,
        signup,
        logout,
        updateAvatar,
        deleteAccount,
        showLogin,
        showSignup,
        showForgotPassword,
        openLogin,
        openSignup,
        openForgotPassword,
        closeModals,
        closeForgotPassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
