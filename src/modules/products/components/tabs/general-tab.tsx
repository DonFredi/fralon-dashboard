"use client";

import { useEffect, useState } from "react";
import { Activity } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "@/shared/components/shared/FormError";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { useGetCategories } from "@/modules/categories/hooks/use-get-categories";
import { useUpdateProduct } from "../../hooks/use-update-product";
import type { ProductWithRelations } from "../../products.repository";
import { updateProductSchema, type UpdateProductInput } from "../../schemas/udate-product.schema";
import { slugify } from "@/shared/utils/slugify";

interface GeneralTabProps {
  product: ProductWithRelations;
}

export default function GeneralTab({ product }: GeneralTabProps) {
  const { data: categories, isFetching } = useGetCategories();
  const { mutateAsync, isPending, isSuccess } = useUpdateProduct(product.id);
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      slug: product.slug ?? "",
      category_id: product.category_id ?? undefined,
      description: product.description ?? "",
      is_active: product.is_active,
    },
  });

  const name = watch("name");

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(name ?? ""), { shouldValidate: true });
    }
  }, [name, slugTouched, setValue]);

  useEffect(() => {
    if (product) {
      reset({ ...product, category_id: product.category_id ?? undefined, description: product.description ?? "" });
    }
  }, [product, reset]);

  const handleUpdateProduct: SubmitHandler<UpdateProductInput> = async (data) => {
    try {
      const updatedProduct = await mutateAsync(data);
      reset({
        ...updatedProduct,
        category_id: updatedProduct.category_id ?? undefined,
        description: updatedProduct.category_id ?? undefined,
      });
    } catch {
      setError("root", { message: "Failed to save changes. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleUpdateProduct)} className="space-y-6 max-w-135 mx-0 pt-4">
      <Activity mode={errors.root ? "visible" : "hidden"}>
        <FormError>{errors.root?.message}</FormError>
      </Activity>

      <FieldGroup className="grid grid-cols-1 gap-4">
        <Field>
          <FieldLabel htmlFor="name">Product name</FieldLabel>
          <Input id="name" disabled={isPending} {...register("name")} />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input id="slug" disabled={isPending} {...register("slug", { onChange: () => setSlugTouched(true) })} />
          <FieldDescription>yourstore.com/products/{watch("slug")}</FieldDescription>
          {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
        </Field>

        <Controller
          name="category_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Category</FieldLabel>
              <Select disabled={isPending} name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder={isFetching ? "Loading..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea id="description" disabled={isPending} {...register("description")} />
          {errors.description && <FieldError>{errors.description.message}</FieldError>}
        </Field>

        <Controller
          name="is_active"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} orientation="horizontal">
              <FieldLabel htmlFor={field.name}>Active</FieldLabel>
              <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || isSuccess || !isDirty}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
