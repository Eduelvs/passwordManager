"use client";

import {
  clearStoredAccessToken,
  setStoredAccessToken,
} from "@/lib/auth-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginBody, type RegisterBody } from "../api/auth";
import { authKeys, passwordKeys } from "../query-keys";

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: RegisterBody) => authApi.register(body),
    onSuccess: (data) => {
      setStoredAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      queryClient.invalidateQueries({ queryKey: passwordKeys.all });
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginBody) => authApi.login(body),
    onSuccess: (data) => {
      setStoredAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      queryClient.invalidateQueries({ queryKey: passwordKeys.all });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearStoredAccessToken();
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      queryClient.removeQueries({ queryKey: passwordKeys.all });
    },
  });
}
