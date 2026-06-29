// modules/products/hooks/use-save-image-records.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productImagesService } from "../../services/product-images.service";
import { productKeys } from "../../lib/product-query-keys";

interface SaveRecordsPayload {
  storagePaths: string[];
  variantId: string | null;
}

export function useSaveImageRecords(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storagePaths, variantId }: SaveRecordsPayload) =>
      productImagesService.saveImageRecords(productId, storagePaths, variantId),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: productKeys.images(productId) });
      toast.success(saved.length === 1 ? "Image saved" : `${saved.length} images saved`);
    },
    onError: () => {
      toast.error("Failed to save image records", {
        description: "Files uploaded but could not be saved. Please try again.",
      });
    },
  });
}
