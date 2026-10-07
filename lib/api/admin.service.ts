import { api, type QueryParams } from "@/lib/api/client";
import type {
  BloodGroup,
  IAuditLog,
  IPaginated,
  IUser,
  Role,
  UserStatus,
} from "@/types";

export interface IAdminDashboardStats {
  users: {
    total: number;
    donors: number;
    patients: number;
  };
  bloodRequests: {
    total: number;
    fulfilled: number;
    pending: number;
    matched: number;
    fulfillmentRatePercentage: string;
  };
  financials: {
    totalTransactions: number;
    totalRevenueCollected: number;
  };
  bloodGroupSupplyDistribution: Array<{
    bloodGroup: BloodGroup;
    count: number;
  }>;
}

export interface IAdminUserParams extends QueryParams {
  role?: Role | "ALL";
  status?: UserStatus | "ALL";
  search?: string;
  page?: number;
  limit?: number;
}

export const adminService = {
  getDashboardStats: async (): Promise<IAdminDashboardStats> => {
    const res = await api.get<IAdminDashboardStats>("/admin/dashboard-stats");
    return res.data;
  },

  getAllUsers: async (
    params?: IAdminUserParams,
  ): Promise<IPaginated<IUser>> => {
    const res = await api.get<IUser[]>("/admin/users", params);
    return {
      data: res.data || [],
      meta: res.meta || {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 10,
        total: res.data?.length || 0,
        totalPages: 1,
      },
    };
  },

  updateUserStatus: async (
    userId: string,
    status: UserStatus,
  ): Promise<IUser> => {
    const res = await api.patch<IUser>(`/admin/users/${userId}/status`, {
      status,
    });
    return res.data;
  },

  updateUserRole: async (userId: string, role: Role): Promise<IUser> => {
    const res = await api.patch<IUser>(`/admin/users/${userId}/role`, {
      role,
    });
    return res.data;
  },

  getAuditLogs: async (
    params?: QueryParams,
  ): Promise<IPaginated<IAuditLog>> => {
    const res = await api.get<IAuditLog[]>("/admin/audit-logs", params);
    return {
      data: res.data || [],
      meta: res.meta || {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 20,
        total: res.data?.length || 0,
        totalPages: 1,
      },
    };
  },
};
