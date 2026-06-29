"use client";
import { useMutation } from "@tanstack/react-query";
import type { NewProductInput } from "../../schemas/new-product.schema";
import { productsService } from "../../services/products.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { queryClient } from "@/shared/lib/query-client";
import { productKeys } from "../../lib/product-query-keys";

export const useCreateProduct = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: NewProductInput) => productsService.createProduct(data),
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      router.push(`/products/${product.id}?tab=variants`);
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
