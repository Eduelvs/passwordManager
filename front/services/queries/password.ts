"use client";

import { useQuery } from "@tanstack/react-query";
import { passwordApi } from "../api/password";
import { passwordKeys } from "../query-keys";

export function usePasswordsQuery() {
  return useQuery({
    queryKey: passwordKeys.list(),
    queryFn: () => passwordApi.list(),
  });
}

export function usePasswordQuery(id: string | undefined) {
  return useQuery({
    queryKey: passwordKeys.detail(id ?? ""),
    queryFn: () => passwordApi.getOne(id!),
    enabled: Boolean(id),
  });
}
