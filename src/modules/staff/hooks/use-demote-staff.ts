"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "../services/staff.service";
import { staffKeys } from "../lib/staff-query-keys";
import { toast } from "sonner";

export const useDemoteStaff = (staffId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => staffService.demoteToCustomer(staffId),
    onSuccess: () => {
      // remove from staff cache entirely and redirect handled in component
      queryClient.invalidateQueries({ queryKey: staffKeys.all() });
      queryClient.removeQueries({ queryKey: staffKeys.detail(staffId) });
      toast.success("Staff member demoted to customer");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to demote staff member");
    },
  });
};
