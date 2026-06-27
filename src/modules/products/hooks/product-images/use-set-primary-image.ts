// modules/products/hooks/use-set-primary-image.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productImagesService } from "../../services/product-images.service";

export function useSetPrimaryImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => productImagesService.setPrimaryImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", productId, "images"] });
      toast.success("Primary image updated");
    },
    onError: () => {
      toast.error("Failed to update primary image");
    },
  });
}
