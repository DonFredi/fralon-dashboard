// modules/products/hooks/use-update-variant.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productVariantsService } from "../../services/product-variants.service";
import type { VariantInput } from "../../schemas/product-variant.schema";
import { productKeys } from "../../lib/product-query-keys";

export function useUpdateVariant(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, input }: { variantId: string; input: VariantInput }) =>
      productVariantsService.updateVariant(variantId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.variants(productId) });
      toast.success("Variant updated", {
        description: "Changes saved successfully.",
      });
    },
    onError: () => {
      toast.error("Failed to update variant", {
        description: "Something went wrong. Please try again.",
      });
    },
  });
}
