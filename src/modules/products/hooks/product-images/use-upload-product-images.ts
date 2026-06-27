// modules/products/hooks/use-upload-product-images.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productImagesService } from "../../services/product-images.service";

interface UploadPayload {
  files: File[];
  variantId: string | null;
}

export function useUploadProductImages(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ files, variantId }: UploadPayload) => productImagesService.uploadImages(productId, files, variantId),
    onSuccess: (uploaded) => {
      queryClient.invalidateQueries({ queryKey: ["products", productId, "images"] });
      toast.success(uploaded.length === 1 ? "Image uploaded" : `${uploaded.length} images uploaded`);
    },
    onError: (error: Error) => {
      toast.error("Upload failed", { description: error.message });
    },
  });
}
