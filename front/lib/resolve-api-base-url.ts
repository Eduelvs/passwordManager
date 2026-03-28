/**
 * No browser, a URL da API vem de GET /api/config (servidor Next lê API_URL em runtime).
 * Assim a Railway pode definir só `API_URL` no serviço do front, sem falhar o bundle.
 */
let cached: string | null = null;

export async function resolveApiBaseUrl(): Promise<string> {
  if (cached) {
    return cached;
  }

  if (typeof window === "undefined") {
    const raw =
      process.env.NEXT_PUBLIC_API_URL ??
      process.env.API_URL ??
      "http://localhost:3000";
    cached = raw.replace(/\/$/, "");
    return cached;
  }

  const res = await fetch(`${window.location.origin}/api/config`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Falha ao obter /api/config (${res.status})`);
  }
  const data = (await res.json()) as { apiBaseUrl: string };
  cached = String(data.apiBaseUrl).replace(/\/$/, "");
  return cached;
}

/** Para testes ou logout que limpam estado; próximo fetch volta a ler /api/config. */
export function clearApiBaseUrlCache(): void {
  cached = null;
}
