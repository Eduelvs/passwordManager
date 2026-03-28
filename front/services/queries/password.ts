"use client";

import { getStoredJwtSub } from "@/lib/jwt-sub";
import { useQuery } from "@tanstack/react-query";
import { passwordApi } from "../api/password";
import { passwordKeys } from "../query-keys";

export function usePasswordsQuery() {
  const userId = getStoredJwtSub();
  return useQuery({
    queryKey: passwordKeys.list(userId ?? ""),
    queryFn: () => passwordApi.list(),
    enabled: Boolean(userId),
  });
}

export function usePasswordQuery(id: string | undefined) {
  const userId = getStoredJwtSub();
  return useQuery({
    queryKey: passwordKeys.detail(userId ?? "", id ?? ""),
    queryFn: () => passwordApi.getOne(id!),
    enabled: Boolean(id && userId),
  });
}
