import { APIResponse } from "../types";

const DEFAULT_SERVER_URL = "http://localhost:5000";

export const SERVER_URL = (
  import.meta.env.VITE_SERVER_URL || DEFAULT_SERVER_URL
).replace(/\/$/, "");

export const API_BASE = `${SERVER_URL}/api/v1`;

export async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<APIResponse<T>> {
  const response = await fetch(url, init);

  let payload: APIResponse<T> | null = null;
  try {
    payload = (await response.json()) as APIResponse<T>;
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || "Request failed";
    throw new Error(message);
  }

  if (!payload) {
    throw new Error("Invalid response from server");
  }

  return payload;
}
