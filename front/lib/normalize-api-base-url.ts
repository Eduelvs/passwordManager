/**
 * Sem `https://`, o browser trata o host como caminho relativo ao site atual
 * (ex.: eduelvs.../passwordmanager... em vez da API).
 */
export function normalizeApiBaseUrl(raw: string): string {
  const s = raw.trim().replace(/\/$/, "");
  if (!s) {
    return "http://localhost:3000";
  }
  if (/^https?:\/\//i.test(s)) {
    return s;
  }
  if (/^(localhost|127\.0\.0\.1)(\:|$)/i.test(s) || /^localhost:/i.test(s)) {
    return `http://${s}`;
  }
  return `https://${s}`;
}
