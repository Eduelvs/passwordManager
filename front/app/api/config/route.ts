import { NextResponse } from "next/server";

/** Sempre dinâmico: lê env em runtime (Railway), não no build do cliente. */
export const dynamic = "force-dynamic";

/**
 * Expõe a URL base da API para o browser sem depender de NEXT_PUBLIC no bundle.
 * No serviço do front na Railway, define `API_URL` ou `NEXT_PUBLIC_API_URL`
 * com a URL HTTPS da API (ex.: https://passwordmanager.up.railway.app).
 */
export async function GET() {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:3000";
  const apiBaseUrl = raw.replace(/\/$/, "");
  return NextResponse.json({ apiBaseUrl });
}
