// modules/products/hooks/use-product-variants.ts
import { useQuery } from "@tanstack/react-query";
import { productVariantsService } from "../../services/product-variants.service";
import { productKeys } from "../../lib/product-query-keys";

export function useProductVariants(productId: string) {
  return useQuery({
    queryKey: productKeys.variants(productId),
    queryFn: () => productVariantsService.getVariants(productId),
    enabled: !!productId,
  });
}
