"use client";
import { useQuery } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";
import { customerKeys } from "../lib/customer-query-keys";

export const useGetSingleCustomer = (id: string) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customersService.getSingleCustomer(id),
    enabled: !!id,
  });
};
