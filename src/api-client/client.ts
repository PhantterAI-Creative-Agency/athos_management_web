const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/athos_adm/api";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let onRefreshFail: (() => void) | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  }
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export function loadTokens(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("accessToken");
    refreshToken = localStorage.getItem("refreshToken");
  }
  return { accessToken, refreshToken };
}

export function setOnRefreshFail(cb: () => void) {
  onRefreshFail = cb;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const { data } = await res.json();
    const { accessToken: newAccess, refreshToken: newRefresh } = data;
    setTokens(newAccess, newRefresh);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  opts?: { params?: Record<string, string> },
): Promise<T> {
  if (!accessToken) loadTokens();

  const params = opts?.params ? "?" + new URLSearchParams(opts.params).toString() : "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let res = await fetch(`${API_URL}${path}${params}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      res = await fetch(`${API_URL}${path}${params}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      clearTokens();
      onRefreshFail?.();
      throw new ApiError(401, "SESSION_EXPIRED", "Sessão expirada");
    }
  }

  if (!res.ok) {
    let code = "UNKNOWN_ERROR";
    let message = "Erro desconhecido";
    try {
      const err = await res.json();
      code = err.error?.code || code;
      message = err.error?.message || message;
    } catch {}
    throw new ApiError(res.status, code, message);
  }

  if (res.status === 204) return undefined as T;
  const json = await res.json();
  return json.data;
}

export const api = {
  get: <T>(path: string, opts?: { params?: Record<string, string> }) =>
    request<T>("GET", path, undefined, opts),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
