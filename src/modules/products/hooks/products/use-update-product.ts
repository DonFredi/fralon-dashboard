"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProductInput } from "../../schemas/udate-product.schema";
import { productsService } from "../../services/products.service";
import { toast } from "sonner";
import { productKeys } from "../../lib/product-query-keys";

export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) => productsService.updateProduct(productId, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(productKeys.detail(productId), (old: any) => ({
        ...old,
        ...updated,
      }));
      queryClient.invalidateQueries({ queryKey: productKeys.all() }); // refresh the list view too
      toast.success("Product updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
}
