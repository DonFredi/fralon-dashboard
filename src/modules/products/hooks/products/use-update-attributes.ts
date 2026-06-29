// modules/products/hooks/use-update-attributes.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsService } from "../../services/products.service";
import { productKeys } from "../../lib/product-query-keys";

export function useUpdateAttributes(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attributes: Record<string, string>) => productsService.updateMetadata(productId, attributes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      // also refresh the list since metadata may appear there later
      queryClient.invalidateQueries({ queryKey: productKeys.all() });
      toast.success("Attributes saved");
    },
    onError: () => {
      toast.error("Failed to save attributes", {
        description: "Something went wrong. Please try again.",
      });
    },
  });
}
