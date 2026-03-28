"use client";

import { getStoredJwtSub } from "@/lib/jwt-sub";
import { ApiError } from "@/services/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

/** Redireciona para login quando a API responde 401 (JWT em falta ou inválido). */
export function useRedirectOn401(error: unknown | null | undefined) {
  const router = useRouter();
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.replace("/sign-in");
    }
  }, [error, router]);
}

export function useIsAuthenticated() {
  const router = useRouter();
  return useMemo(() => {
    return getStoredJwtSub() !== null;
  }, []);
}