// modules/products/repository/product-images.repository.ts

import { supabase } from "@/shared/lib/supabase/client";
import type { ProductImage, ProductImageWithUrl } from "../types/product-image.types";
import { ApiCustomError } from "@/shared/errors/api-error";

const BUCKET = "products";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function deriveUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

function withUrl(image: ProductImage): ProductImageWithUrl {
  return { ...image, url: deriveUrl(image.storage_path) };
}

export const productImagesRepository = {
  async getImages(productId: string): Promise<ProductImageWithUrl[]> {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true, nullsFirst: false });

    if (error) throw new ApiCustomError("Failed to fetch images", 500);
    return data.map(withUrl);
  },

  async uploadImages(productId: string, files: File[], variantId?: string | null): Promise<ProductImageWithUrl[]> {
    // validate before touching storage
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new ApiCustomError(`${file.name} is not a supported type. Use PNG, JPG or WEBP.`, 400);
      }
      if (file.size > MAX_SIZE_BYTES) {
        throw new ApiCustomError(`${file.name} exceeds the 5MB limit.`, 400);
      }
    }

    // get current count for sort_order offset + whether any image exists
    const { count } = await supabase
      .from("product_images")
      .select("*", { count: "exact", head: true })
      .eq("product_id", productId);

    const existingCount = count ?? 0;
    const isVeryFirst = existingCount === 0;

    const uploaded: ProductImageWithUrl[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${productId}/${crypto.randomUUID()}.${ext}`;

      const { error: storageError } = await supabase.storage.from(BUCKET).upload(path, file);

      if (storageError) {
        throw new ApiCustomError(`Failed to upload ${file.name}`, 500);
      }

      const { data, error: dbError } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          variant_id: variantId ?? null,
          storage_path: path,
          is_primary: isVeryFirst && i === 0, // first ever image auto-primary
          sort_order: existingCount + i,
        })
        .select()
        .single();

      if (dbError) {
        // best-effort cleanup — remove the orphaned storage file
        await supabase.storage.from(BUCKET).remove([path]);
        throw new ApiCustomError("Failed to save image record", 500);
      }

      uploaded.push(withUrl(data));
    }

    return uploaded;
  },

  async deleteImage(image: ProductImage): Promise<void> {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([image.storage_path]);

    if (storageError) throw new ApiCustomError("Failed to remove image from storage", 500);

    const { error } = await supabase.from("product_images").delete().eq("id", image.id);

    if (error) throw new ApiCustomError("Failed to delete image record", 500);
  },

  async setPrimaryImage(productId: string, imageId: string): Promise<void> {
    // clear existing primary first
    const { error: clearError } = await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);

    if (clearError) throw new ApiCustomError("Failed to clear primary image", 500);

    const { error } = await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId);

    if (error) throw new ApiCustomError("Failed to set primary image", 500);
  },
};
