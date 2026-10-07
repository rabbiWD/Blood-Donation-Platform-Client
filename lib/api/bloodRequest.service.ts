import { api, type QueryParams } from "@/lib/api/client";
import type {
  IBloodRequest,
  IDonorAssignment,
  IPaginated,
  UrgencyLevel,
} from "@/types";

export interface ICreateBloodRequestPayload {
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  district: string;
  urgency: UrgencyLevel;
  neededBy: string;
  additionalNotes?: string;
}

export const bloodRequestService = {
  getAll: async (params?: QueryParams): Promise<IPaginated<IBloodRequest>> => {
    const res = await api.get<IBloodRequest[]>("/blood-requests", params);
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

  getById: async (id: string): Promise<IBloodRequest> => {
    const res = await api.get<IBloodRequest>(`/blood-requests/${id}`);
    return res.data;
  },

  create: async (
    payload: ICreateBloodRequestPayload,
  ): Promise<IBloodRequest> => {
    const res = await api.post<IBloodRequest>("/blood-requests", payload);
    return res.data;
  },

  getMyRequests: async (): Promise<IBloodRequest[]> => {
    const res = await api.get<IBloodRequest[]>("/blood-requests/my-requests");
    return res.data || [];
  },

  respondToRequest: async (requestId: string): Promise<IDonorAssignment> => {
    const res = await api.post<IDonorAssignment>(
      `/blood-requests/${requestId}/respond`,
    );
    return res.data;
  },
};
