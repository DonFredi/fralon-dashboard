// modules/products/pages/single-product-page.tsx
"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetSingleProduct } from "../hooks/useGetSingleProduct";
import ProductDetailHeader from "../components/single-product/components/product-detail-header";
import ProductTabs from "../components/product-tab";
import { useParams } from "next/navigation";
import FullScreenLoader from "@/shared/components/layout/blocks/FullScreenLoader";

export default function SingleProductPage() {
  const params = useParams();
  let productId: string;
  if (!params.id) return <FullScreenLoader />;
  if (typeof params.id === "string") {
    productId = params.id;
  } else {
    productId = params.id[0];
  }
  const { data: product, isLoading, isError } = useGetSingleProduct(productId);

  if (isLoading) {
    return (
      <div className="max-w-150 mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !product) {
    return <div className="py-12 text-center text-sm text-destructive">Product not found.</div>;
  }

  return (
    <div className="space-y-6">
      <ProductDetailHeader product={product} />
      <ProductTabs product={product} />
    </div>
  );
}
