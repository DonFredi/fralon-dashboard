"use client";
import { useQuery } from "@tanstack/react-query";
import { staffService } from "../services/staff.service";
import { staffKeys } from "../lib/staff-query-keys";
import type { StaffFilters } from "../types/staff.types";

export const useGetStaff = (filters: StaffFilters) => {
  return useQuery({
    queryKey: [...staffKeys.all(), filters],
    queryFn: () => staffService.getStaff(filters),
  });
};
