// modules/products/pages/products-page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { useGetProducts } from "../hooks/products/useGetProducts";
import { useGetCategories } from "@/modules/categories/hooks/use-get-categories";
import { useViewPreference } from "../hooks/products/use-view-preference";
import { productColumns } from "../components/products-table/columns";
import ProductsToolbar from "../components/products/ProductsToolbar";
import ProductsGrid from "../components/products/ProductsGrid";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

export default function ProductsPage() {
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  const { view, setView } = useViewPreference();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const isLoading = productsLoading || categoriesLoading;

  const filtered = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return products.filter((p) => {
      const matchesSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || p.category_id === category;
      const matchesStatus =
        status === "all" || (status === "active" && p.is_active) || (status === "inactive" && !p.is_active);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, category, status]);

  const table = useReactTable({
    data: filtered,
    columns: productColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4 p-4 md:p-6">
      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        categories={categories ?? []}
        view={view}
        onViewChange={setView}
      />

      {isLoading && <ProductsListSkeleton view={view} />}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No products found</p>
          <p className="text-xs text-muted-foreground mt-1">
            {products?.length === 0
              ? "Add your first product to get started."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      )}

      {/* ── Grid view ── */}
      {!isLoading && filtered.length > 0 && view === "grid" && <ProductsGrid products={filtered} />}

      {/* ── Table view ── */}
      {!isLoading && filtered.length > 0 && view === "table" && (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/40">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ── Skeleton matches whichever view is active ──
function ProductsListSkeleton({ view }: { view: "table" | "grid" }) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col rounded-lg border overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0">
          <Skeleton className="h-9 w-9 rounded-md shrink-0" />
          <Skeleton className="h-4 flex-1 max-w-48" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}
