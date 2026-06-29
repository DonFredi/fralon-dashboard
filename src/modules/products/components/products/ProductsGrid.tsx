// modules/products/components/ProductsGrid.tsx
import ProductCard from "./ProductCard";
import type { ProductListItem } from "../../types/products.types";

interface ProductsGridProps {
  products: ProductListItem[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
