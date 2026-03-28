import { apiFetch } from "./api";
import type { PasswordEntry } from "../types";

export type CreatePasswordBody = {
  title: string;
  username?: string;
  secret: string;
  notes?: string;
};

export type UpdatePasswordBody = Partial<{
  title: string;
  username: string;
  secret: string;
  notes: string;
}>;

export const passwordApi = {
  list: () => apiFetch<PasswordEntry[]>("/passwords"),

  getOne: (id: string) => apiFetch<PasswordEntry>(`/passwords/${id}`),

  create: (body: CreatePasswordBody) =>
    apiFetch<PasswordEntry>("/passwords", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: UpdatePasswordBody) =>
    apiFetch<PasswordEntry>(`/passwords/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  remove: (id: string) =>
    apiFetch<{ ok: boolean }>(`/passwords/${id}`, {
      method: "DELETE",
    }),
};
