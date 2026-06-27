// modules/products/hooks/use-product-images.ts
import { useQuery } from "@tanstack/react-query";
import { productImagesService } from "../../services/product-images.service";

export function useProductImages(productId: string) {
  return useQuery({
    queryKey: ["products", productId, "images"],
    queryFn: () => productImagesService.getImages(productId),
    enabled: !!productId,
  });
}
