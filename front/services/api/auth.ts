import { apiFetch } from "./api";
import type { AuthUser } from "../types";

export type LoginBody = { email: string; password: string };
export type RegisterBody = LoginBody;

export type AuthResponse = { user: AuthUser };

export const authApi = {
  register: (body: RegisterBody) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: LoginBody) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    apiFetch<{ ok: boolean }>("/auth/logout", {
      method: "POST",
    }),
};
