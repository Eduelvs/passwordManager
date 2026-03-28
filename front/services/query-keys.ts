export const authKeys = {
  all: ["auth"] as const,
};

export const passwordKeys = {
  all: ["passwords"] as const,
  lists: () => [...passwordKeys.all, "list"] as const,
  list: () => [...passwordKeys.lists()] as const,
  details: () => [...passwordKeys.all, "detail"] as const,
  detail: (id: string) => [...passwordKeys.details(), id] as const,
};
