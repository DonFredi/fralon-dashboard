"use client";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "../../services/products.service";
import { productKeys } from "../../lib/product-query-keys";

export const useGetSingleProduct = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productsService.getSingleProduct(productId),
    enabled: !!productId,
  });
};
