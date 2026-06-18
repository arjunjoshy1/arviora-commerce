/**
 * Central HTTP helper for the app.
 *
 * - The access token lives only in memory (never localStorage) to limit XSS risk.
 * - Every request sends cookies (`credentials: 'include'`) so the httpOnly refresh
 *   cookie flows to the API.
 * - On a 401 we transparently try a single token refresh, then retry the request.
 */

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

/** Error thrown for non-2xx responses, carrying a friendly message + status. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function extractError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    // NestJS errors look like { message: string | string[], error, statusCode }.
    if (Array.isArray(data?.message)) return data.message.join(', ');
    if (typeof data?.message === 'string') return data.message;
  } catch {
    /* not JSON */
  }
  return `Request failed (${res.status})`;
}

/** Low-level refresh used only by the 401 retry path (token only). */
async function silentRefresh(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    accessToken = null;
    return false;
  }
  const data = await res.json();
  accessToken = data.accessToken ?? null;
  return Boolean(accessToken);
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retryOn401 = true,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Try one silent refresh + retry, but never for auth endpoints themselves.
  if (res.status === 401 && retryOn401 && !path.startsWith('/auth/')) {
    if (await silentRefresh()) {
      return apiFetch<T>(path, options, false);
    }
  }

  if (!res.ok) {
    throw new ApiError(await extractError(res), res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
