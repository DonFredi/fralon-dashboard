// modules/products/components/tabs/ImagesTab.tsx
"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import ProductImageCard from "../ProductImageCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import type { ProductImageWithUrl } from "@/modules/products/types/product-image.types";
import { useProductImages } from "@/modules/products/hooks/product-images/use-product-images";
import { useProductVariants } from "@/modules/products/hooks/product-variants/use-product-variants";
import { useUploadProductImages } from "@/modules/products/hooks/product-images/use-upload-product-images";
import { useDeleteProductImage } from "@/modules/products/hooks/product-images/use-delete-product-image";
import { useSetPrimaryImage } from "@/modules/products/hooks/product-images/use-set-primary-image";
import type { ProductVariant } from "@/modules/products/types/product-variants.types";
import ImageDropzone from "../ImageDropzone";

interface ImagesTabProps {
  productId: string;
}

// "none" is a sentinel value meaning product-level (no variant)
const NO_VARIANT = "none";

export default function ImagesTab({ productId }: ImagesTabProps) {
  const [deletingImage, setDeletingImage] = useState<ProductImageWithUrl | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>(NO_VARIANT);

  const { data: images, isLoading: imagesLoading } = useProductImages(productId);
  const { data: variants, isLoading: variantsLoading } = useProductVariants(productId);

  const { mutate: upload, isPending: isUploading } = useUploadProductImages(productId);
  const { mutate: deleteImg, isPending: isDeleting } = useDeleteProductImage(productId);
  const { mutate: setPrimary, isPending: isSettingPrimary } = useSetPrimaryImage(productId);

  const isLoading = imagesLoading || variantsLoading;

  // build a lookup map for variant names
  const variantMap = new Map<string, ProductVariant>(variants?.map((v) => [v.id, v]) ?? []);

  // group images: product-level first, then per-variant
  const productImages = images?.filter((img) => img.variant_id === null) ?? [];
  const variantImages = images?.filter((img) => img.variant_id !== null) ?? [];

  // further group variant images by variant_id
  const byVariant = variantImages.reduce<Map<string, ProductImageWithUrl[]>>((acc, img) => {
    const key = img.variant_id!;
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key)!.push(img);
    return acc;
  }, new Map());

  const handleUpload = (files: File[]) => {
    upload({
      files,
      variantId: selectedVariant === NO_VARIANT ? null : selectedVariant,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingImage) return;
    deleteImg(deletingImage, { onSettled: () => setDeletingImage(null) });
  };

  const hasImages = (images?.length ?? 0) > 0;

  if (isLoading) return <ImagesTabSkeleton />;

  return (
    <div className="space-y-6 pt-4">
      {/* ── Header ── */}
      <div>
        <h3 className="text-sm font-medium">Product images</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Upload images for the product overall, or associate them with a specific variant. The primary image is used as
          the storefront thumbnail.
        </p>
      </div>

      {/* ── Upload section ── */}
      <div className="space-y-3">
        {/* variant selector — only show if variants exist */}
        {(variants?.length ?? 0) > 0 && (
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground shrink-0">Associate with:</p>
            <Select value={selectedVariant} onValueChange={setSelectedVariant} disabled={isUploading}>
              <SelectTrigger className="h-8 w-52 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-xs">Upload target</SelectLabel>
                  <SelectItem value={NO_VARIANT}>Product (no specific variant)</SelectItem>
                  {variants!.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <ImageDropzone onFiles={handleUpload} isPending={isUploading} />
      </div>

      {/* ── Empty state ── */}
      {!hasImages && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
          <div className="rounded-full bg-muted p-3 mb-3">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No images yet</p>
          <p className="text-xs text-muted-foreground mt-1">Upload at least one image using the area above.</p>
        </div>
      )}

      {/* ── Product-level images ── */}
      {productImages.length > 0 && (
        <ImageGroup title="Product images" description="Shown for all variants">
          {productImages.map((image) => (
            <ProductImageCard
              key={image.id}
              image={image}
              onSetPrimary={(id) => setPrimary(id)}
              onDelete={(img) => setDeletingImage(img)}
              isSettingPrimary={isSettingPrimary}
              isDeleting={isDeleting && deletingImage?.id === image.id}
            />
          ))}
        </ImageGroup>
      )}

      {/* ── Per-variant image groups ── */}
      {Array.from(byVariant.entries()).map(([variantId, imgs]) => {
        const variantName = variantMap.get(variantId)?.name ?? "Unknown variant";
        return (
          <ImageGroup key={variantId} title={variantName} description="Shown only for this variant">
            {imgs.map((image) => (
              <ProductImageCard
                key={image.id}
                image={image}
                variantName={variantName}
                onSetPrimary={(id) => setPrimary(id)}
                onDelete={(img) => setDeletingImage(img)}
                isSettingPrimary={isSettingPrimary}
                isDeleting={isDeleting && deletingImage?.id === image.id}
              />
            ))}
          </ImageGroup>
        );
      })}

      {/* ── Delete confirmation ── */}
      <AlertDialog
        open={!!deletingImage}
        onOpenChange={(open) => {
          if (!open) setDeletingImage(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the image from storage and cannot be undone.
              {(deletingImage?.is_primary ?? false) && (
                <span className="mt-2 block font-medium text-destructive">
                  This is your primary image. Another will need to be set as primary after deletion.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete image"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ── Small layout component — keeps the grouped sections consistent ──
function ImageGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-medium text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{children}</div>
    </div>
  );
}

function ImagesTabSkeleton() {
  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-64" />
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-3 w-24" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
