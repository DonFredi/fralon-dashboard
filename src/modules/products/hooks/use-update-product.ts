"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProductInput } from "../schemas/udate-product.schema";
import { productsService } from "../products.service";
import { toast } from "sonner";

export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) => productsService.updateProduct(productId, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["products", productId], (old: any) => ({
        ...old,
        ...updated,
      }));
      queryClient.invalidateQueries({ queryKey: ["products"] }); // refresh the list view too
      toast.success("Product updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
  });
}
