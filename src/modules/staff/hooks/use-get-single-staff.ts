"use client";
import { useQuery } from "@tanstack/react-query";
import { staffService } from "../services/staff.service";
import { staffKeys } from "../lib/staff-query-keys";

export const useGetSingleStaff = (id: string) => {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffService.getSingleStaff(id),
    enabled: !!id,
  });
};
