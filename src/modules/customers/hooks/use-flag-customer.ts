"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customersService } from "../services/customers.service";
import { customerKeys } from "../lib/customer-query-keys";
import { toast } from "sonner";

export const useFlagCustomer = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flagged: boolean) => customersService.flagCustomer(customerId, flagged),
    onSuccess: (updated) => {
      // update the detail cache immediately without a refetch
      queryClient.setQueryData(customerKeys.detail(customerId), (old: any) =>
        old ? { ...old, flagged: updated.flagged } : old
      );
      // also refresh the list so the flagged indicator stays in sync
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
      toast.success(updated.flagged ? "Customer flagged" : "Flag removed");
    },
    onError: () => {
      toast.error("Failed to update flag — please try again");
    },
  });
};
