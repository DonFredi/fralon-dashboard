// modules/products/services/product-images.service.ts
import { productImagesRepository } from "../repository/product-images.repository";
import type { ProductImage } from "../types/product-image.types";

export const productImagesService = {
  getImages(productId: string) {
    return productImagesRepository.getImages(productId);
  },
  uploadImages(productId: string, files: File[], variantId?: string | null) {
    return productImagesRepository.uploadImages(productId, files, variantId);
  },
  deleteImage(image: ProductImage) {
    return productImagesRepository.deleteImage(image);
  },
  setPrimaryImage(productId: string, imageId: string) {
    return productImagesRepository.setPrimaryImage(productId, imageId);
  },
};
