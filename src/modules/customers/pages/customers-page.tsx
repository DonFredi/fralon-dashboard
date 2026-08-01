"use client";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Users } from "lucide-react";
import { useGetCustomers } from "../hooks/use-get-customers";
import { customerColumns } from "../components/customer-columns";
import CustomersToolbar from "../components/customers-toolbar";
import { AddWalkInSheet } from "../components/add-walkin-sheet";
import { defaultCustomerFilters, type CustomerFilters } from "../types/customers.types";

export default function CustomersPage() {
  const [filters, setFilters] = useState<CustomerFilters>(defaultCustomerFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, isPending, isPlaceholderData } = useGetCustomers(filters);

  const customers = data?.data ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / filters.pageSize);
  const showingFrom = totalCount === 0 ? 0 : (filters.page - 1) * filters.pageSize + 1;
  const showingTo = Math.min(filters.page * filters.pageSize, totalCount);

  const onFilterChange = (partial: Partial<CustomerFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const table = useReactTable({
    data: customers,
    columns: customerColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      {/* toolbar — search, filters, add button */}
      <CustomersToolbar
        filters={filters}
        onFilterChange={onFilterChange}
        onAddCustomer={() => setSheetOpen(true)}
      />

      {/* table */}
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {/* loading skeletons */}
            {isPending &&
              Array.from({ length: filters.pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {customerColumns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* rows */}
            {!isPending &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={isPlaceholderData ? "opacity-50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* empty state */}
            {!isPending && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={customerColumns.length} className="h-60 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="size-8 opacity-30" />
                    <p className="text-sm font-medium">No customers found</p>
                    <p className="text-xs">
                      {filters.search || filters.type !== "all" || filters.flagged !== "all"
                        ? "Try adjusting your filters or search"
                        : "Add your first walk-in customer to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination footer */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {showingFrom}–{showingTo} of {totalCount} customers
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onFilterChange({ page: filters.page - 1 })}
              disabled={filters.page <= 1 || isPending}
            >
              Previous
            </Button>
            <span className="px-1">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onFilterChange({ page: filters.page + 1 })}
              disabled={filters.page >= totalPages || isPending}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* add walk-in customer sheet */}
      <AddWalkInSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
