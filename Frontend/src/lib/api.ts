// Single fetch wrapper. Reads base URL from env, attaches JWT, no timeout.
const BASE = import.meta.env.VITE_API_BASE_URL as string;

const TOKEN_KEY = "rs_jwt";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type ApiOpts = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  raw?: boolean; // if true, return Response without parsing
  auth?: boolean; // default true
};

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

export async function api(path: string, opts: ApiOpts = {}): Promise<Response> {
  const headers: Record<string, string> = {};
  const auth = opts.auth ?? true;
  if (auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }

  let body: BodyInit | undefined;
  if (opts.formData) {
    body = opts.formData;
    // do not set content-type; browser sets multipart boundary
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body,
    credentials: "include",
  });

  if (res.status === 401 && auth) {
    setToken(null);
    if (onUnauthorized) onUnauthorized();
    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok && !opts.raw) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {
      // ignore
    }
    throw new ApiError(msg, res.status);
  }

  return res;
}

export async function apiJson<T>(path: string, opts: ApiOpts = {}): Promise<T> {
  const res = await api(path, opts);
  return (await res.json()) as T;
}
