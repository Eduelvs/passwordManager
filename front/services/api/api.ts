function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

const baseUrl = getBaseUrl();

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
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    throw new ApiError(res.status, messageFromBody(data), data);
  }
  return data as T;
}
