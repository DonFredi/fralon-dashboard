"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Users } from "lucide-react";
import { useGetStaff } from "../hooks/use-get-staff";
import { staffColumns } from "../components/staff-columns";
import StaffToolbar from "../components/staff-toolbar";
import { PromoteStaffSheet } from "../components/promote-staff-sheet";
import { defaultStaffFilters, type StaffFilters } from "../types/staff.types";
import { useAuth } from "@/modules/auth/shared/useAuth";

export default function StaffPage() {
  const router = useRouter();
  const { isAdmin, isInitialized } = useAuth();
  const [filters, setFilters] = useState<StaffFilters>(defaultStaffFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  // admin-only guard — redirect non-admins away
  useEffect(() => {
    if (isInitialized && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, isInitialized, router]);

  const { data: staff = [], isPending } = useGetStaff(filters);

  const onFilterChange = (partial: Partial<StaffFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const table = useReactTable({
    data: staff,
    columns: staffColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!isAdmin) return null;

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <StaffToolbar
        filters={filters}
        onFilterChange={onFilterChange}
        onPromote={() => setSheetOpen(true)}
        total={staff.length}
      />

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
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {staffColumns.map((_, j) => (
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
                  className="cursor-pointer"
                  onClick={() => router.push(`/staff/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {/* empty state */}
            {!isPending && staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={staffColumns.length} className="h-60 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Users className="size-8 opacity-30" />
                    <p className="text-sm font-medium">No staff members found</p>
                    <p className="text-xs">
                      {filters.search || filters.isActive !== "all"
                        ? "Try adjusting your filters"
                        : "Promote a customer to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PromoteStaffSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
