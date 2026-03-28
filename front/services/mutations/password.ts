"use client";

import { getStoredJwtSub } from "@/lib/jwt-sub";
import {
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  passwordApi,
  type CreatePasswordBody,
  type UpdatePasswordBody,
} from "../api/password";
import { passwordKeys } from "../query-keys";

function invalidateForCurrentUser(queryClient: QueryClient) {
  const uid = getStoredJwtSub();
  if (uid) {
    queryClient.invalidateQueries({ queryKey: passwordKeys.list(uid) });
  } else {
    queryClient.invalidateQueries({ queryKey: passwordKeys.all });
  }
}

export function useCreatePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePasswordBody) => passwordApi.create(body),
    onSuccess: () => invalidateForCurrentUser(queryClient),
  });
}

export function useUpdatePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdatePasswordBody }) =>
      passwordApi.update(id, body),
    onSuccess: (_data, { id }) => {
      const uid = getStoredJwtSub();
      if (uid) {
        queryClient.invalidateQueries({ queryKey: passwordKeys.list(uid) });
        queryClient.invalidateQueries({
          queryKey: passwordKeys.detail(uid, id),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: passwordKeys.all });
      }
    },
  });
}

export function useDeletePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => passwordApi.remove(id),
    onSuccess: (_data, id) => {
      const uid = getStoredJwtSub();
      if (uid) {
        queryClient.invalidateQueries({ queryKey: passwordKeys.list(uid) });
        queryClient.removeQueries({
          queryKey: passwordKeys.detail(uid, id),
        });
      } else {
        queryClient.invalidateQueries({ queryKey: passwordKeys.all });
      }
    },
  });
}
