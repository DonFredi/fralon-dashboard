import type { Database } from "@/shared/lib/supabase/database.types";

export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

// enriched with derived URL — used everywhere in the UI layer
export interface ProductImageWithUrl extends ProductImage {
  url: string;
}
