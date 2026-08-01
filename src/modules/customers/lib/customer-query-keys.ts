import type { CustomerFilters } from "../types/customers.types";

export const customerKeys = {
  // list — keyed by the full filter object so each filter combo has its own cache entry
  all: (filters?: Partial<CustomerFilters>) => ["customers", "list", filters ?? {}] as const,

  // single customer detail
  detail: (id: string) => ["customers", "detail", id] as const,
};
