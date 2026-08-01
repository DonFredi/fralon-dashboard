"use client";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { StaffFilters } from "../types/staff.types";

interface StaffToolbarProps {
  filters: StaffFilters;
  onFilterChange: (partial: Partial<StaffFilters>) => void;
  onPromote: () => void;
  total: number;
}

export default function StaffToolbar({
  filters,
  onFilterChange,
  onPromote,
  total,
}: StaffToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* left — title + count */}
      <div>
        <h1 className="text-xl font-semibold">Staff</h1>
        {total > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">{total} member{total !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* right — controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Name or email..."
            className="h-8 pl-8 w-44 text-xs"
          />
        </div>

        {/* status filter */}
        <Select
          value={filters.isActive}
          onValueChange={(val) =>
            onFilterChange({ isActive: val as StaffFilters["isActive"] })
          }
        >
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* promote customer to staff */}
        <Button size="sm" onClick={onPromote}>
          <UserPlus className="size-4" />
          Promote customer
        </Button>
      </div>
    </div>
  );
}
