import type { ApiErrorPayload } from "@/lib/types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(
  /\/$/,
  "",
);

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type TokenCache = { token: string; expiresAt: number } | null;
let tokenCache: TokenCache = null;

export function clearTokenCache(): void {
  tokenCache = null;
}

/**
 * BetterAuth's JWT plugin exposes GET /api/auth/token. The browser session
 * cookie authorises the request, so no extra client plugin is needed.
 */
export async function getAuthToken(force = false): Promise<string | null> {
  if (!force && tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  try {
    const response = await fetch("/api/auth/token", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data: unknown = await response.json();
    const token =
      typeof data === "object" && data !== null && "token" in data
        ? (data as { token?: unknown }).token
        : undefined;

    if (typeof token !== "string" || token.length === 0) return null;

    tokenCache = { token, expiresAt: Date.now() + 5 * 60 * 1000 };
    return token;
  } catch {
    return null;
  }
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = "GET", body } = options;
  const token = await getAuthToken();

  const send = (bearer: string | null) =>
    fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

  let response: Response;

  try {
    response = await send(token);

    if (response.status === 401) {
      clearTokenCache();
      const freshToken = await getAuthToken(true);
      if (freshToken) {
        response = await send(freshToken);
      }
    }
  } catch {
    throw new ApiError(
      "Could not reach the Sahajjo server. Check your connection and try again.",
      0,
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = (payload ?? {}) as ApiErrorPayload;
    throw new ApiError(
      errorPayload.message ?? "Something went wrong. Please try again.",
      response.status,
      errorPayload.errors ?? {},
    );
  }

  return payload as T;
}
