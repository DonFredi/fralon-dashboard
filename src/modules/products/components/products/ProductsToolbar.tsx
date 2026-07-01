// modules/products/components/ProductsToolbar.tsx
"use client";

import Link from "next/link";
import { PlusIcon, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import ProductsViewToggle from "./ProductsViewToggle";
import type { ViewPreference } from "../../hooks/products/use-view-preference";
import type { Category } from "@/modules/categories/types/categories.types";
import { H2 } from "@/shared/components/layout/typography/Typography";

interface ProductsToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  categories: Category[];
  view: ViewPreference;
  onViewChange: (view: ViewPreference) => void;
}

export default function ProductsToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
  view,
  onViewChange,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* left — title */}
      <H2>Products</H2>

      {/* right — controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or SKU..."
            className="h-8 pl-8 w-48 text-xs"
          />
        </div>

        {/* category filter */}
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* status filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 w-28 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* view toggle */}
        <ProductsViewToggle view={view} onChange={onViewChange} />

        {/* add product */}
        <Button size="sm" asChild>
          <Link href="/products/new">
            <PlusIcon className="size-4" /> Add product
          </Link>
        </Button>
      </div>
    </div>
  );
}
