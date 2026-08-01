import type { Database } from "@/shared/lib/supabase/database.types";

export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// customer joined with relevant profile fields —
// profile is null for walk-in customers (they have no auth account)
export interface CustomerWithProfile extends Customer {
  profile: Pick<Profile, "membership" | "avatar_url"> | null;
  created_by_profile: Pick<Profile, "full_name"> | null;
}

// filter + pagination state for the list page
export interface CustomerFilters {
  page: number;
  pageSize: number;
  search: string;
  type: "all" | "online" | "walk_in";
  flagged: "all" | "flagged" | "clean";
  isActive: "all" | "active" | "inactive";
}

export const defaultCustomerFilters: CustomerFilters = {
  page: 1,
  pageSize: 20,
  search: "",
  type: "all",
  flagged: "all",
  isActive: "all",
};
