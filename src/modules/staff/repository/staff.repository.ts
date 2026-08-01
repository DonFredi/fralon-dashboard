import { supabase } from "@/shared/lib/supabase/client";
import { ApiCustomError } from "@/shared/errors/api-error";
import type { StaffMember, StaffFilters } from "../types/staff.types";

export const staffRepository = {
  // ── list all staff members ────────────────────────────────────
  async getStaff(filters: StaffFilters): Promise<StaffMember[]> {
    let query = supabase.from("profiles").select("*").eq("role", "staff").order("created_at", { ascending: false });

    if (filters.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.isActive === "active") {
      query = query.eq("is_active", true);
    } else if (filters.isActive === "inactive") {
      query = query.eq("is_active", false);
    }

    const { data, error } = await query;

    if (error) throw new ApiCustomError("Failed to fetch staff", 500);
    return data ?? [];
  },

  // ── single staff member ───────────────────────────────────────
  async getSingleStaff(id: string): Promise<StaffMember> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).eq("role", "staff").single();

    if (error) {
      if (error.code === "PGRST116") throw new ApiCustomError("Staff member not found", 404);
      throw new ApiCustomError("Failed to fetch staff member", 500);
    }

    return data;
  },

  // ── find a customer by email — used in the promote flow ───────
  async findCustomerByEmail(email: string): Promise<StaffMember | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("email", email).single();

    if (error) {
      // PGRST116 = no rows — customer not found, not a hard error
      if (error.code === "PGRST116") return null;
      throw new ApiCustomError("Failed to search for customer", 500);
    }

    return data;
  },

  // ── promote customer → staff via secure Postgres function ─────
  async promoteToStaff(targetUserId: string): Promise<void> {
    const { error } = await supabase.rpc("promote_to_staff", {
      target_user_id: targetUserId,
    });

    if (error) throw new ApiCustomError(error.message, 500);
  },

  // ── demote staff → customer via secure Postgres function ──────
  async demoteToCustomer(targetUserId: string): Promise<void> {
    const { error } = await supabase.rpc("demote_to_customer", {
      target_user_id: targetUserId,
    });

    if (error) throw new ApiCustomError(error.message, 500);
  },

  // ── activate or deactivate a staff member ─────────────────────
  async setStaffActive(targetUserId: string, active: boolean): Promise<void> {
    const { error } = await supabase.rpc("set_staff_active", {
      target_user_id: targetUserId,
      active,
    });

    if (error) throw new ApiCustomError(error.message, 500);
  },
};
