import { getStoredAccessToken } from "@/lib/auth-token";

/** Lê o `sub` (id do utilizador) do JWT guardado — só para cache/UX; a API valida o token. */
export function getStoredJwtSub(): string | null {
  const token = getStoredAccessToken();
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { sub?: unknown };
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
