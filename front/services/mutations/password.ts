"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  passwordApi,
  type CreatePasswordBody,
  type UpdatePasswordBody,
} from "../api/password";
import { passwordKeys } from "../query-keys";

export function useCreatePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreatePasswordBody) => passwordApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: passwordKeys.lists() });
    },
  });
}

export function useUpdatePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdatePasswordBody }) =>
      passwordApi.update(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: passwordKeys.lists() });
      queryClient.invalidateQueries({ queryKey: passwordKeys.detail(id) });
    },
  });
}
