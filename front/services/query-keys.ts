export const authKeys = {
  all: ["auth"] as const,
};

export const passwordKeys = {
  all: ["passwords"] as const,
  lists: () => [...passwordKeys.all, "list"] as const,
  /** Inclui o id do utilizador (`sub` do JWT) para não misturar cache entre contas. */
  list: (userId: string) => [...passwordKeys.lists(), userId] as const,
  details: () => [...passwordKeys.all, "detail"] as const,
  detail: (userId: string, id: string) =>
    [...passwordKeys.details(), userId, id] as const,
};
