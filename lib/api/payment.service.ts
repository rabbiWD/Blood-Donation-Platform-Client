import { api } from "@/lib/api/client";
import type { IPayment, PaymentGateway } from "@/types";

export interface IInitiatePaymentPayload {
  amount: number;
  currency?: string;
  gateway?: PaymentGateway;
  requestId?: string;
  payerReference?: string;
}

export interface IInitiatePaymentResponse {
  payment: IPayment;
  gateway: string;
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
}

export const paymentService = {
  initiatePayment: async (
    payload: IInitiatePaymentPayload,
  ): Promise<IInitiatePaymentResponse> => {
    const res = await api.post<IInitiatePaymentResponse>(
      "/payments/initiate",
      payload,
    );
    return res.data;
  },

  getPaymentHistory: async (): Promise<IPayment[]> => {
    const res = await api.get<IPayment[]>("/payments/history");
    return res.data || [];
  },

  getPaymentById: async (id: string): Promise<IPayment> => {
    const res = await api.get<IPayment>(`/payments/${id}`);
    return res.data;
  },

  queryBkashPayment: async (
    paymentId: string,
  ): Promise<Record<string, unknown>> => {
    const res = await api.get<Record<string, unknown>>(
      `/payments/bkash/query/${paymentId}`,
    );
    return res.data;
  },
};
