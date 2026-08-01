import { supabase } from "@/shared/lib/supabase/client";
import { ApiCustomError } from "@/shared/errors/api-error";
import type { Customer, CustomerFilters, CustomerWithProfile } from "../types/customers.types";
import type { WalkInCustomerInput } from "../schemas/walkin-customer.schema";

export const customersRepository = {
  async getCustomers(
    filters: CustomerFilters
  ): Promise<{ data: CustomerWithProfile[]; count: number }> {
    const { page, pageSize, search, type, flagged, isActive } = filters;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("customers")
      .select(
        `
        *,
        profile:profiles!profile_id(membership, avatar_url),
        created_by_profile:profiles!created_by(full_name)
      `,
        { count: "exact" }
      );

    // search across name, phone, email
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    if (type !== "all") {
      query = query.eq("customer_type", type);
    }

    if (flagged === "flagged") {
      query = query.eq("flagged", true);
    } else if (flagged === "clean") {
      query = query.eq("flagged", false);
    }

    if (isActive === "active") {
      query = query.eq("is_active", true);
    } else if (isActive === "inactive") {
      query = query.eq("is_active", false);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new ApiCustomError("Failed to fetch customers", 500);
    }

    return { data: (data as CustomerWithProfile[]) ?? [], count: count ?? 0 };
  },

  async getSingleCustomer(id: string): Promise<CustomerWithProfile> {
    const { data, error } = await supabase
      .from("customers")
      .select(
        `
        *,
        profile:profiles!profile_id(membership, avatar_url),
        created_by_profile:profiles!created_by(full_name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new ApiCustomError("Customer not found", 404);
      }
      throw new ApiCustomError("Failed to fetch customer", 500);
    }

    return data as CustomerWithProfile;
  },

  async createWalkInCustomer(
    data: WalkInCustomerInput & { created_by: string }
  ): Promise<Customer> {
    const { data: customer, error } = await supabase
      .from("customers")
      .insert({ ...data, customer_type: "walk_in" })
      .select()
      .single();

    if (error) {
      throw new ApiCustomError("Failed to create customer", 500);
    }

    return customer;
  },

  async flagCustomer(id: string, flagged: boolean): Promise<Customer> {
    const { data, error } = await supabase
      .from("customers")
      .update({ flagged })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new ApiCustomError("Failed to update customer flag", 500);
    }

    return data;
  },
};
