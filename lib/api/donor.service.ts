import { api, type QueryParams } from "@/lib/api/client";
import type { IDonorProfile, IPaginated } from "@/types";

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
};
