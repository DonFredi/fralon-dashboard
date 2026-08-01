"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "../services/staff.service";
import { staffKeys } from "../lib/staff-query-keys";
import { toast } from "sonner";

export const useToggleStaffActive = (staffId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (active: boolean) => staffService.setStaffActive(staffId, active),
    onSuccess: (_, active) => {
      // optimistically update the detail cache
      queryClient.setQueryData(staffKeys.detail(staffId), (old: any) =>
        old ? { ...old, is_active: active } : old
      );
      queryClient.invalidateQueries({ queryKey: staffKeys.all() });
      toast.success(active ? "Staff member reactivated" : "Staff member deactivated");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update staff status");
    },
  });
};
