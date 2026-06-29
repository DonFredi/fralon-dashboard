// modules/products/components/ProductsViewToggle.tsx
"use client";

import { LayoutGrid, Table2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";
import type { ViewPreference } from "../../hooks/products/use-view-preference";

interface ProductsViewToggleProps {
  view: ViewPreference;
  onChange: (view: ViewPreference) => void;
}

export default function ProductsViewToggle({ view, onChange }: ProductsViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(val) => {
        if (val) onChange(val as ViewPreference);
      }}
      className="border rounded-md"
    >
      <ToggleGroupItem value="table" aria-label="Table view" className="h-8 w-8 data-[state=on]:bg-muted">
        <Table2 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label="Grid view" className="h-8 w-8 data-[state=on]:bg-muted">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
