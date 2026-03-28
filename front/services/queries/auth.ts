"use client";

/**
 * O backend não expõe GET /me; use authKeys em mutations (login/register/logout)
 * ou estado local para o utilizador autenticado.
 */
export { authKeys } from "../query-keys";
