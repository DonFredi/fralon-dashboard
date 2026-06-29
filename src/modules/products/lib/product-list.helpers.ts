// modules/products/lib/product-list.helpers.ts
import type { ProductListItem } from "../types/products.types";
import type { ProductImage } from "../types/product-image.types";

const BUCKET = "products";

export function getPrimaryImageUrl(
  images: Pick<ProductImage, "storage_path" | "is_primary">[],
  getPublicUrl: (bucket: string, path: string) => string,
): string | null {
  const primary = images.find((img) => img.is_primary) ?? images[0];
  if (!primary) return null;
  return getPublicUrl(BUCKET, primary.storage_path);
}

export function getPriceRange(variants: ProductListItem["product_variants"]): string {
  const active = variants.filter((v) => v.is_active);
  if (active.length === 0) return "--";
  const prices = active.map((v) => v.price_ksh);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `KSH ${min.toLocaleString()}` : `KSH ${min.toLocaleString()} – ${max.toLocaleString()}`;
}

export function getTotalStock(variants: ProductListItem["product_variants"]): number {
  return variants.reduce((sum, v) => sum + v.stock_quantity, 0);
}

export function getStockStatus(stock: number): "out" | "low" | "ok" {
  if (stock === 0) return "out";
  if (stock <= 10) return "low";
  return "ok";
}
