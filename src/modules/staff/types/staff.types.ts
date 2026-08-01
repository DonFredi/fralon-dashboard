import type { Database } from "@/shared/lib/supabase/database.types";

// a staff member is just a profile with role = 'staff'
export type StaffMember = Database["public"]["Tables"]["profiles"]["Row"];

// filters for the staff list — no pagination since staff lists are small
export interface StaffFilters {
  search: string;
  isActive: "all" | "active" | "inactive";
}

export const defaultStaffFilters: StaffFilters = {
  search: "",
  isActive: "all",
};
