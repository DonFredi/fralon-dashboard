// modules/products/components/AddVariantForm.tsx
"use client";

import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema, type VariantInput } from "../../schemas/product-variant.schema";
import { useCreateVariant } from "../../hooks/product-variants/use-create-variant";
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { H3, H4 } from "@/shared/components/layout/typography/Typography";

interface AddVariantFormProps {
  productId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddVariantForm({ productId, onSuccess, onCancel }: AddVariantFormProps) {
  const { mutateAsync, isPending } = useCreateVariant(productId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<VariantInput>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price_ksh: 0,
      wholesale_price_ksh: 0,
      stock_quantity: 0,
      weight_gms: 0,
      is_active: true,
    },
  });

  const handleAddVariant: SubmitHandler<VariantInput> = async (data) => {
    try {
      await mutateAsync(data);
      reset();
      onSuccess();
    } catch (error) {
      // error toast handled in the hook
      console.log("adding variant error;", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddVariant)} className="mx-0">
      <div className="rounded-lg border border-dashed bg-muted/30 p-4 space-y-5">
        <H3 className="text-sm font-medium">New variant</H3>

        <FieldGroup className="space-y-4">
          {/* ── Row 1: Name + SKU ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input placeholder="e.g. 500g Smooth" disabled={isPending} {...register("name")} />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>SKU</FieldLabel>
              <Input placeholder="e.g. PB-SM-500" disabled={isPending} {...register("sku")} />
              {errors.sku && <FieldError>{errors.sku.message}</FieldError>}
            </Field>
          </div>

          {/* ── Row 2: Prices ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Price (KSH)</FieldLabel>
              <Input
                type="number"
                min={0}
                step={0.01}
                disabled={isPending}
                {...register("price_ksh", { valueAsNumber: true })}
              />
              {errors.price_ksh && <FieldError>{errors.price_ksh.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Wholesale price (KSH)</FieldLabel>
              <Input
                type="number"
                min={0}
                step={0.01}
                disabled={isPending}
                {...register("wholesale_price_ksh", { valueAsNumber: true })}
              />
              {errors.wholesale_price_ksh && <FieldError>{errors.wholesale_price_ksh.message}</FieldError>}
            </Field>
          </div>

          {/* ── Row 3: Stock + Weight ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Stock quantity</FieldLabel>
              <Input
                type="number"
                min={0}
                disabled={isPending}
                {...register("stock_quantity", { valueAsNumber: true })}
              />
              {errors.stock_quantity && <FieldError>{errors.stock_quantity.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Weight (g)</FieldLabel>
              <Input type="number" min={10} disabled={isPending} {...register("weight_gms", { valueAsNumber: true })} />
              {errors.weight_gms && <FieldError>{errors.weight_gms.message}</FieldError>}
            </Field>
          </div>

          {/* ── Description ── */}
          <Field>
            <FieldLabel>
              Description <span className="text-muted-foreground font-normal text-xs">(optional)</span>
            </FieldLabel>
            <Textarea
              placeholder="Any extra details specific to this variant..."
              rows={2}
              disabled={isPending}
              {...register("description")}
            />
            {errors.description && <FieldError>{errors.description.message}</FieldError>}
          </Field>

          {/* ── Active toggle ── */}
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal" className="gap-3">
                <div>
                  <FieldLabel>Active</FieldLabel>
                  <FieldDescription>Inactive variants won't appear in the storefront.</FieldDescription>
                </div>
                <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
              </Field>
            )}
          />
        </FieldGroup>

        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Creating..." : "Create variant"}
          </Button>
        </div>
      </div>
    </form>
  );
}
