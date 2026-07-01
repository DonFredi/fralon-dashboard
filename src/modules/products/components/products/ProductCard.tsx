// modules/products/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/shared/lib/supabase/client";
import { Badge } from "@/shared/components/ui/badge";
import { getPriceRange, getTotalStock, getStockStatus } from "../../lib/product-list.helpers";
import type { ProductListItem } from "../../types/products.types";

interface ProductCardProps {
  product: ProductListItem;
}

const BUCKET = "products";

function getPublicUrl(storagePath: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.product_images.find((img) => img.is_primary) ?? product.product_images[0] ?? null;

  const imageUrl = primaryImage ? getPublicUrl(primaryImage.storage_path) : null;
  const priceRange = getPriceRange(product.product_variants);
  const totalStock = getTotalStock(product.product_variants);
  const stockStatus = getStockStatus(totalStock);
  const variantCount = product.product_variants.length;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col rounded-md border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* ── Thumbnail ── */}
      <div className="relative aspect-square w-full bg-muted overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}

        {/* status badge — overlaid top-right */}
        <div className="absolute top-2 right-2">
          <Badge
            className={
              product.is_active
                ? "bg-success/10 text-success text-[10px] px-1.5 py-0.5"
                : "bg-destructive/10 text-destructive text-[10px] px-1.5 py-0.5"
            }
          >
            {product.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1.5 p-3">
        {/* name */}
        <p className="text-sm font-medium leading-tight line-clamp-1 group-hover:underline">{product.name}</p>

        {/* category */}
        {product.categories && <p className="text-xs text-muted-foreground">{product.categories.name}</p>}

        <div className="flex items-center justify-between mt-1 flex-wrap gap-1">
          {/* price range */}
          <p className="text-xs font-medium">{priceRange}</p>

          {/* stock */}
          <p
            className={`text-xs font-medium ${
              stockStatus === "out"
                ? "text-destructive"
                : stockStatus === "low"
                  ? "text-amber-600"
                  : "text-muted-foreground"
            }`}
          >
            {totalStock === 0 ? "Out of stock" : `${totalStock.toLocaleString()} in stock`}
          </p>
        </div>

        {/* variant count */}
        <p className="text-[11px] text-muted-foreground">
          {variantCount === 0 ? "No variants" : `${variantCount} variant${variantCount !== 1 ? "s" : ""}`}
        </p>
      </div>
    </Link>
  );
}
