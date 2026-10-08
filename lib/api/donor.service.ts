import { api, type QueryParams } from "@/lib/api/client";
import type { IDonorProfile, IPaginated } from "@/types";

export interface IPlatformStats {
  livesSaved: number;
  activeDonors: number;
  districtsCovered: number;
  avgResponseTimeMinutes: number;
}

export const donorService = {
  getEligibleDonors: async (
    params?: QueryParams,
  ): Promise<IPaginated<IDonorProfile>> => {
    const res = await api.get<IDonorProfile[]>("/users/donors", params);
    return {
      data: res.data || [],
      meta: res.meta || {
        page: Number(params?.page) || 1,
        limit: Number(params?.limit) || 9,
        total: res.data?.length || 0,
        totalPages:
          Math.ceil((res.data?.length || 0) / (Number(params?.limit) || 9)) ||
          1,
      },
    };
  },

  getPlatformStats: async (): Promise<IPlatformStats> => {
    try {
      const res = await api.get<IPlatformStats>("/users/platform-stats");
      return (
        res.data || {
          livesSaved: 1840,
          activeDonors: 950,
          districtsCovered: 64,
          avgResponseTimeMinutes: 12,
        }
      );
    } catch {
      return {
        livesSaved: 1840,
        activeDonors: 950,
        districtsCovered: 64,
        avgResponseTimeMinutes: 12,
      };
    }
  },
};
