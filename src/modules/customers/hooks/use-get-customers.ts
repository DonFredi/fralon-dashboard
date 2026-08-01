"use client";
import { useQuery } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";
import { customerKeys } from "../lib/customer-query-keys";
import type { CustomerFilters } from "../types/customers.types";

export const useGetCustomers = (filters: CustomerFilters) => {
  return useQuery({
    queryKey: customerKeys.all(filters),
    queryFn: () => customersService.getCustomers(filters),
    // keeps the previous page data visible while the next page is loading
    placeholderData: (prev) => prev,
  });
};
