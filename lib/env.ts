const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const env = {
  API_URL: apiUrl ?? "http://localhost:5000/api/v1",
  // GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
} as const;
