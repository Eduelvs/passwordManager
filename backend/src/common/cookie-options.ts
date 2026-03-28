import type { CookieOptions } from 'express';

/**
 * Em produção (front e API em hosts diferentes, ex. dois serviços Railway)
 * é necessário SameSite=None + Secure para o browser enviar o cookie em fetch
 * cross-origin com credentials.
 */
export function getAuthCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
  };
}
