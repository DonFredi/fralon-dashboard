export const staffKeys = {
  all: () => ["staff", "list"] as const,
  detail: (id: string) => ["staff", "detail", id] as const,
};
