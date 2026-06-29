import { supabase } from "@/shared/lib/supabase/client";
import type { Category } from "../types/categories.types";
import { ApiCustomError } from "@/shared/errors/api-error";

export const categoriesRepository = {
  async getCategories(): Promise<Category[]> {
    const { data: categories, error } = await supabase.from("categories").select("*").order("name");

    if (error) throw new ApiCustomError("Failed to fetch categories", 500);
    return categories;
  },
};
