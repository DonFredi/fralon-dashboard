// modules/products/components/ProductTabs.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import GeneralTab from "./tabs/general-tab";
import VariantsTab from "./tabs/variants-tab";
import AttributesTab from "./tabs/attributes-tab";
import type { ProductWithRelations } from "../repository/products.repository";
import ImagesTab from "./product-images/tabs/ImagesTab";

interface ProductTabsProps {
  product: ProductWithRelations;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "general";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="space-x-2">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="variants">Variants</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="attributes">Attributes</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralTab product={product} />
      </TabsContent>
      <TabsContent value="variants">
        <VariantsTab productId={product.id} />
      </TabsContent>
      <TabsContent value="images">
        <ImagesTab productId={product.id} />
      </TabsContent>
      <TabsContent value="attributes">
        <AttributesTab product={product} />
      </TabsContent>
    </Tabs>
  );
}
