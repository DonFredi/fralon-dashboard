"use client";
import { ArrowLeft, Flag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { CustomerTypeBadge } from "./customer-type-badge";
import { CustomerFlagButton } from "./customer-flag-button";
import { useAuth } from "@/modules/auth/shared/useAuth";
import type { CustomerWithProfile } from "../types/customers.types";

interface Props {
  customer: CustomerWithProfile;
}

export function CustomerDetailHeader({ customer }: Props) {
  const { isAdmin } = useAuth();
  const initials = customer.full_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarUrl = customer.profile?.avatar_url;

  return (
    <div className="flex flex-col gap-4">
      {/* back link */}
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground">
        <Link href="/customers">
          <ArrowLeft className="size-4" />
          Back to customers
        </Link>
      </Button>

      {/* header row */}
      <div className="flex items-start justify-between gap-4">
        {/* avatar + name + badges */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 rounded-full bg-muted overflow-hidden flex items-center justify-center text-base font-semibold text-muted-foreground">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold leading-none">{customer.full_name}</h1>
              {customer.flagged && (
                <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  <Flag className="size-3" />
                  Flagged
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <CustomerTypeBadge type={customer.customer_type as "online" | "walk_in"} />
              {!customer.is_active && (
                <span className="text-xs text-muted-foreground">· Inactive</span>
              )}
            </div>
          </div>
        </div>

        {/* actions — flag button visible to admin only */}
        {isAdmin && (
          <div className="shrink-0">
            <CustomerFlagButton
              customerId={customer.id}
              isFlagged={customer.flagged ?? false}
              customerName={customer.full_name}
            />
          </div>
        )}
      </div>
    </div>
  );
}
