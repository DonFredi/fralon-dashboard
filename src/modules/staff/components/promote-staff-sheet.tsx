"use client";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promoteStaffSchema, type PromoteStaffInput } from "../schemas/promote-staff.schema";
import { staffService } from "../services/staff.service";
import { usePromoteToStaff } from "../hooks/use-promote-to-staff";
import type { StaffMember } from "../types/staff.types";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Search, UserCheck, AlertCircle } from "lucide-react";
import { timeDiff } from "@/shared/utils/time-diff";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; customer: StaffMember }
  | { status: "already_staff" }
  | { status: "not_found" };

export function PromoteStaffSheet({ open, onOpenChange }: Props) {
  const [searchState, setSearchState] = useState<SearchState>({ status: "idle" });
  const { mutateAsync: promote, isPending: isPromoting } = usePromoteToStaff();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromoteStaffInput>({
    resolver: zodResolver(promoteStaffSchema),
    defaultValues: { email: "" },
  });

  const handleClose = () => {
    reset();
    setSearchState({ status: "idle" });
    onOpenChange(false);
  };

  const onSearch: SubmitHandler<PromoteStaffInput> = async ({ email }) => {
    setSearchState({ status: "loading" });
    try {
      const result = await staffService.findCustomerByEmail(email);

      if (!result) {
        setSearchState({ status: "not_found" });
        return;
      }

      if (result.role === "staff" || result.role === "admin") {
        setSearchState({ status: "already_staff" });
        return;
      }

      setSearchState({ status: "found", customer: result });
    } catch {
      setSearchState({ status: "not_found" });
    }
  };

  const handlePromote = async () => {
    if (searchState.status !== "found") return;
    try {
      await promote(searchState.customer.id);
      handleClose();
    } catch {
      // error handled in hook via toast
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-lg px-3">
        <SheetHeader>
          <SheetTitle>Promote to staff</SheetTitle>
          <SheetDescription>
            Search for a registered customer by their email address, then promote them to staff.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 px-1">
          {/* email search form */}
          <form onSubmit={handleSubmit(onSearch)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Customer email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. jane@example.com"
                  className="flex-1"
                  {...register("email")}
                  onChange={() => setSearchState({ status: "idle" })}
                />
                <Button type="submit" size="sm" variant="outline" disabled={searchState.status === "loading"}>
                  <Search className="size-4" />
                  {searchState.status === "loading" ? "Searching..." : "Search"}
                </Button>
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </form>

          {/* ── search result area ──────────────────────────────── */}

          {/* not found */}
          {searchState.status === "not_found" && (
            <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              <AlertCircle className="size-4 shrink-0" />
              No customer found with that email address.
            </div>
          )}

          {/* already staff or admin */}
          {searchState.status === "already_staff" && (
            <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              <AlertCircle className="size-4 shrink-0" />
              This person already has staff or admin access.
            </div>
          )}

          {/* customer found — show card for confirmation */}
          {searchState.status === "found" && (
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
              <div className="flex items-start gap-3">
                {/* avatar */}
                <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                  {searchState.customer.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{searchState.customer.full_name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Customer
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{searchState.customer.email}</span>
                  {searchState.customer.phone && (
                    <span className="text-xs text-muted-foreground">{searchState.customer.phone}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Joined {timeDiff(searchState.customer.created_at)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground border-t pt-3">
                Promoting this person will grant them staff access to the dashboard. They will be able to manage
                products, customers, and process operations.
              </p>

              <Button className="w-full" size="sm" onClick={handlePromote} disabled={isPromoting}>
                <UserCheck className="size-4" />
                {isPromoting ? "Promoting..." : `Promote ${searchState.customer.full_name} to staff`}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
