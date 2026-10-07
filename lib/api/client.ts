import { env } from "@/lib/env";
import type { IApiResponse } from "@/types";

export interface IErrorSource {
  field: string | number;
  message: string;
}

/** Normalised error thrown for every failed API call. */
export class ApiError extends Error {
  readonly status: number;
  readonly errors: IErrorSource[];

  constructor(message: string, status: number, errors: IErrorSource[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

interface IRequestOptions extends Omit<RequestInit, "body"> {
  params?: QueryParams;
  body?: unknown;
}

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(
    `${env.API_URL}${path.startsWith("/") ? path : `/${path}`}`,
  );
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function isErrorBody(
  value: unknown,
): value is { message?: string; errors?: IErrorSource[] } {
  return typeof value === "object" && value !== null;
}

/**
 * Core request helper. Sends cookies, serialises JSON and
 * throws a typed ApiError on any non-2xx / network failure.
 */
export async function request<T>(
  path: string,
  { params, body, headers, ...init }: IRequestOptions = {},
): Promise<IApiResponse<T>> {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      ...init,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body !== undefined && !isFormData
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Please check your connection.",
      0,
    );
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      isErrorBody(payload) && payload.message
        ? payload.message
        : "Something went wrong. Please try again.";
    const errors =
      isErrorBody(payload) && Array.isArray(payload.errors)
        ? payload.errors
        : [];
    throw new ApiError(message, response.status, errors);
  }

  return payload as IApiResponse<T>;
}

export const api = {
  get: <T>(path: string, params?: QueryParams, init?: RequestInit) =>
    request<T>(path, { ...init, method: "GET", params }),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PUT", body }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "DELETE" }),
};
