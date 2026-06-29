/* "use client";

import { ColumnDef } from "@tanstack/react-table";
import type { ProductWithRelations } from "../../repository/products.repository";
import { timeDiff } from "@/shared/utils/time-diff";
import StatusBadge from "../StatusBadge";
import TableImage from "./TableImage";
import Link from "next/link";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<ProductWithRelations>[] = [
  {
    id: "image",
    cell: ({ row }) => (
      <TableImage href={row.original.product_images.find((img) => img.is_primary)?.storage_path || ""} />
    ),
    header: "",
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <Link href={`/products/${row.original.id}`} className="hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    header: "Category",
    cell: ({ row }) => row.original.categories?.name ?? "—",
  },
  {
    cell: ({ row }) => <StatusBadge status={row.original.is_active ? "active" : "inactive"} />,
    header: "Status",
  },
  {
    header: "Variants",
    cell: ({ row }) => row.original.product_variants?.length ?? 0,
  },
  {
    header: "Price",
    cell: ({ row }) => {
      const variants = row.original.product_variants ?? [];
      if (variants.length === 0) return "—";

      const prices = variants.map((v) => v.price_ksh);
      const min = Math.min(...prices);
      const max = Math.max(...prices);

      return min === max ? `Ksh ${min.toLocaleString()}` : `Ksh ${min.toLocaleString()} – ${max.toLocaleString()}`;
    },
  },
  {
    header: "Stock",
    cell: ({ row }) => {
      const variants = row.original.product_variants ?? [];
      const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
      return totalStock;
    },
  },
  {
    header: "Updated",
    cell: ({ row }) => timeDiff(row.original.updated_at),
  },
];
 */

// modules/products/components/products-list/products-table-columns.tsx
"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { supabase } from "@/shared/lib/supabase/client";
import { getPriceRange, getTotalStock, getStockStatus } from "../../lib/product-list.helpers";
import { timeDiff } from "@/shared/utils/time-diff";
import type { ProductListItem } from "../../types/products.types";

const BUCKET = "products";

export const productColumns: ColumnDef<ProductListItem>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      const primary = product.product_images.find((i) => i.is_primary) ?? product.product_images[0];
      const imageUrl = primary ? supabase.storage.from(BUCKET).getPublicUrl(primary.storage_path).data.publicUrl : null;

      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-sm border bg-muted overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
          <Link href={`/products/${product.id}`} className="font-medium text-sm hover:underline line-clamp-1">
            {product.name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "category_id",
    header: "Category",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.categories?.name ?? "—"}</span>,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.is_active;
      return (
        <Badge className={active ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "variants",
    header: "Variants",
    cell: ({ row }) => <span className="text-sm">{row.original.product_variants.length}</span>,
  },
  {
    id: "price",
    header: "Price",
    cell: ({ row }) => <span className="text-sm font-mono">{getPriceRange(row.original.product_variants)}</span>,
  },
  {
    id: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = getTotalStock(row.original.product_variants);
      const status = getStockStatus(stock);
      return (
        <span
          className={`text-sm font-medium ${
            status === "out" ? "text-destructive" : status === "low" ? "text-amber-600" : ""
          }`}
        >
          {stock.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Updated",
    sortingFn: "datetime",
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{timeDiff(row.original.updated_at)}</span>,
  },
];
