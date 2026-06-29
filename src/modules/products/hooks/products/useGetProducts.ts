"use client";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "../../services/products.service";
import { productKeys } from "../../lib/product-query-keys";

export const useGetProducts = () => {
  return useQuery({
    queryKey: productKeys.all(),
    queryFn: productsService.getProducts,
  });
};
