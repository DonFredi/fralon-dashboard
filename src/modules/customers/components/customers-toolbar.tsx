"use client";
import { Search, PlusIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { H2 } from "@/shared/components/layout/typography/Typography";
import type { CustomerFilters } from "../types/customers.types";

interface CustomersToolbarProps {
  filters: CustomerFilters;
  onFilterChange: (partial: Partial<CustomerFilters>) => void;
  onAddCustomer: () => void;
}

export default function CustomersToolbar({
  filters,
  onFilterChange,
  onAddCustomer,
}: CustomersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* left — title */}
      <H2>Customers</H2>

      {/* right — controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            placeholder="Name, phone or email..."
            className="h-8 pl-8 w-48 text-xs"
          />
        </div>

        {/* type filter */}
        <Select
          value={filters.type}
          onValueChange={(val) =>
            onFilterChange({ type: val as CustomerFilters["type"], page: 1 })
          }
        >
          <SelectTrigger className="h-8 w-30 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="walk_in">Walk-in</SelectItem>
          </SelectContent>
        </Select>

        {/* flagged filter */}
        <Select
          value={filters.flagged}
          onValueChange={(val) =>
            onFilterChange({ flagged: val as CustomerFilters["flagged"], page: 1 })
          }
        >
          <SelectTrigger className="h-8 w-30 text-xs">
            <SelectValue placeholder="Flag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="clean">Clean</SelectItem>
          </SelectContent>
        </Select>

        {/* status filter */}
        <Select
          value={filters.isActive}
          onValueChange={(val) =>
            onFilterChange({ isActive: val as CustomerFilters["isActive"], page: 1 })
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

        {/* add walk-in customer */}
        <Button size="sm" onClick={onAddCustomer}>
          <PlusIcon className="size-4" />
          Add customer
        </Button>
      </div>
    </div>
  );
}
