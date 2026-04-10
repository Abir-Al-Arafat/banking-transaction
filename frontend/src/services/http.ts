import { APIResponse } from "../types";

export const API_BASE = "/api/v1";

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
