"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { walkInCustomerSchema, type WalkInCustomerInput } from "../schemas/walkin-customer.schema";
import { useCreateWalkInCustomer } from "../hooks/use-create-walkin-customer";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { Label } from "@/shared/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddWalkInSheet({ open, onOpenChange }: Props) {
  const { mutateAsync, isPending } = useCreateWalkInCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WalkInCustomerInput>({
    resolver: zodResolver(walkInCustomerSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<WalkInCustomerInput> = async (data) => {
    try {
      await mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch {
      // error is handled in the hook via toast
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg px-4">
        <SheetHeader className="px-0">
          <SheetTitle>Add walk-in customer</SheetTitle>
          <SheetDescription>
            Record a customer who doesn't have an online account. Only name is required.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5 px-1">
          {/* name */}
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" placeholder="e.g. Jane Wanjiku" disabled={isPending} {...register("full_name")} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>

          {/* phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Phone <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input id="phone" placeholder="e.g. 0712 345 678" disabled={isPending} {...register("phone")} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          {/* email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. jane@example.com"
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          {/* notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any useful context about this customer..."
              disabled={isPending}
              rows={3}
              {...register("notes")}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Adding..." : "Add customer"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
