import apiClient from "./config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "banned";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Partnership {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  message?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPartnerships: number;
  pendingPartnerships: number;
  newUsersThisMonth: number;
  approvedPartnerships: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAdminStats = async (): Promise<AdminStats> => {
  const res = await apiClient.get("/admin/stats");
  return res.data.data;
};

export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<PaginatedResponse<AdminUser>> => {
  const res = await apiClient.get("/admin/users", { params });
  return res.data.data;
};

export const updateUserRole = async (
  userId: string,
  role: string
): Promise<AdminUser> => {
  const res = await apiClient.patch(`/admin/users/${userId}/role`, { role });
  return res.data.data;
};

export const updateUserStatus = async (
  userId: string,
  status: string
): Promise<AdminUser> => {
  const res = await apiClient.patch(`/admin/users/${userId}/status`, { status });
  return res.data.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}`);
};

// ─── Partnerships ─────────────────────────────────────────────────────────────

export const getPartnerships = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}): Promise<PaginatedResponse<Partnership>> => {
  const res = await apiClient.get("/admin/partnerships", { params });
  return res.data.data;
};

export const updatePartnershipStatus = async (
  id: string,
  status: "approved" | "rejected",
  note?: string
): Promise<Partnership> => {
  const res = await apiClient.patch(`/admin/partnerships/${id}/status`, {
    status,
    note,
  });
  return res.data.data;
};

export const deletePartnership = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/partnerships/${id}`);
};
