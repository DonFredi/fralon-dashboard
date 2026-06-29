// modules/products/hooks/use-create-variant.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productVariantsService } from "../../services/product-variants.service";
import type { VariantInput } from "../../schemas/product-variant.schema";
import { productKeys } from "../../lib/product-query-keys";

export function useCreateVariant(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VariantInput) => productVariantsService.createVariant(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.variants(productId) });
      toast.success("Variant created", {
        description: "The variant was added successfully.",
      });
    },
    onError: () => {
      toast.error("Failed to create variant", {
        description: "Something went wrong. Please try again.",
      });
    },
  });
}
