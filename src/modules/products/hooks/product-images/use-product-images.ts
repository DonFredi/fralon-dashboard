// modules/products/hooks/use-product-images.ts
import { useQuery } from "@tanstack/react-query";
import { productImagesService } from "../../services/product-images.service";
import { productKeys } from "../../lib/product-query-keys";

export function useProductImages(productId: string) {
  return useQuery({
    queryKey: productKeys.images(productId),
    queryFn: () => productImagesService.getImages(productId),
    enabled: !!productId,
  });
}
