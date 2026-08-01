"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "../services/staff.service";
import { staffKeys } from "../lib/staff-query-keys";
import { toast } from "sonner";

export const usePromoteToStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) => staffService.promoteToStaff(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all() });
      toast.success("Staff member promoted successfully");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to promote staff member");
    },
  });
};
