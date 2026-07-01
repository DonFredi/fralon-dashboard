// modules/products/components/ProductImageCard.tsx
"use client";

import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { ProductImageWithUrl } from "../../types/product-image.types";
import { cn } from "@/shared/lib/utils";

interface ProductImageCardProps {
  image: ProductImageWithUrl;
  variantName?: string; // passed in from parent lookup
  onSetPrimary: (imageId: string) => void;
  onDelete: (image: ProductImageWithUrl) => void;
  isSettingPrimary: boolean;
  isDeleting: boolean;
}

export default function ProductImageCard({
  image,
  variantName,
  onSetPrimary,
  onDelete,
  isSettingPrimary,
  isDeleting,
}: ProductImageCardProps) {
  const isPrimary = image.is_primary ?? false;
  const isBusy = isSettingPrimary || isDeleting;

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border bg-muted",
        isPrimary && "ring-2 ring-primary ring-offset-2",
      )}
    >
      {/* image */}
      <Image
        src={image.url}
        alt={variantName ? `${variantName} image` : "Product image"}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        className="object-cover transition-opacity group-hover:opacity-75"
      />

      {/* primary badge */}
      {isPrimary && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground shadow">
          <Star className="h-2.5 w-2.5 fill-current" />
          Primary
        </div>
      )}

      {/* variant badge — only for variant-specific images */}
      {variantName && !isPrimary && (
        <div className="absolute bottom-2 left-2 max-w-[80%] truncate rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-foreground shadow">
          {variantName}
        </div>
      )}

      {/* hover controls */}
      <div className="absolute inset-0 flex items-start justify-between p-2 lg:opacity-0 transition-opacity lg:group-hover:opacity-100">
        {!isPrimary ? (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-7 w-7 shadow"
            disabled={isBusy}
            title="Set as primary image"
            onClick={() => onSetPrimary(image.id)}
          >
            <Star className="h-3.5 w-3.5" />
            <span className="sr-only">Set as primary</span>
          </Button>
        ) : (
          <span /> // keeps delete button pushed to the right
        )}

        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-7 w-7 shadow"
          disabled={isBusy}
          title="Delete image"
          onClick={() => onDelete(image)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Delete image</span>
        </Button>
      </div>

      {/* busy overlay */}
      {isBusy && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
