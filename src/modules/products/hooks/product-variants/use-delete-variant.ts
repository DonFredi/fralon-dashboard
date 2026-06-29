// modules/products/hooks/use-delete-variant.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productVariantsService } from "../../services/product-variants.service";
import { productKeys } from "../../lib/product-query-keys";

export function useDeleteVariant(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) => productVariantsService.deleteVariant(variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.variants(productId) });
      toast.success("Variant deleted");
    },
    onError: () => {
      toast.error("Failed to delete variant", {
        description: "Something went wrong. Please try again.",
      });
    },
  });
}
