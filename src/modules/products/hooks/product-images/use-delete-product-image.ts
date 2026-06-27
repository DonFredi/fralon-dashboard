// modules/products/hooks/use-delete-product-image.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProductImage } from "../../types/product-image.types";
import { productImagesService } from "../../services/product-images.service";

export function useDeleteProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: ProductImage) => productImagesService.deleteImage(image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId, "images"] });
      toast.success("Image deleted");
    },
    onError: () => {
      toast.error("Failed to delete image", {
        description: "Something went wrong. Please try again.",
      });
    },
  });
}
