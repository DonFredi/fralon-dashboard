"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";
import { customerKeys } from "../lib/customer-query-keys";
import { useAuth } from "@/modules/auth/shared/useAuth";
import { toast } from "sonner";
import type { WalkInCustomerInput } from "../schemas/walkin-customer.schema";

export const useCreateWalkInCustomer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: WalkInCustomerInput) => {
      if (!user) throw new Error("You must be logged in to add a customer");
      return customersService.createWalkInCustomer({ ...data, created_by: user.id });
    },
    onSuccess: () => {
      // invalidate the whole list so all cached filter combos refetch
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
      toast.success("Customer added successfully");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to add customer");
    },
  });
};
