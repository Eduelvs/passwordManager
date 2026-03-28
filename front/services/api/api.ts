import {
  clearStoredAccessToken,
  getStoredAccessToken,
} from "@/lib/auth-token";

function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

const baseUrl = getBaseUrl();

let warnedWrongApiHost = false;

function warnIfProdFrontCallsLocalhost(url: string) {
  if (typeof window === "undefined" || warnedWrongApiHost) return;
  try {
    const u = new URL(url);
    const isLocalApi =
      u.hostname === "localhost" || u.hostname === "127.0.0.1";
    const onDeployedFront =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    if (isLocalApi && onDeployedFront) {
      warnedWrongApiHost = true;
      console.error(
        "[passwordManager] A API aponta para localhost, mas o site está em produção. " +
          "Defina NEXT_PUBLIC_API_URL na Railway (serviço do front) com a URL HTTPS da API e faça redeploy.",
      );
    }
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function messageFromBody(data: unknown): string {
  if (data == null || typeof data !== "object") {
    return "Erro na requisição";
  }
  const rec = data as Record<string, unknown>;
  const m = rec.message;
  if (typeof m === "string") return m;
  if (Array.isArray(m) && m.length && typeof m[0] === "string") {
    return m.join(", ");
  }
  if (typeof rec.error === "string") return rec.error;
  return "Erro na requisição";
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
  warnIfProdFrontCallsLocalhost(url);
  const token = getStoredAccessToken();
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    if (res.status === 401) {
      clearStoredAccessToken();
    }
    throw new ApiError(res.status, messageFromBody(data), data);
  }
  return data as T;
}
