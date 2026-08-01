"use client";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Flag } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { timeDiff } from "@/shared/utils/time-diff";
import { CustomerTypeBadge } from "./customer-type-badge";
import type { CustomerWithProfile } from "../types/customers.types";

export const customerColumns: ColumnDef<CustomerWithProfile>[] = [
  {
    id: "name",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      const initials = customer.full_name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const avatarUrl = customer.profile?.avatar_url;

      return (
        <div className="flex items-center gap-3">
          {/* avatar — profile photo for online customers, initials for walk-ins */}
          <div className="h-8 w-8 shrink-0 rounded-full bg-muted overflow-hidden flex items-center justify-center text-xs font-medium text-muted-foreground">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-col">
            <Link
              href={`/customers/${customer.id}`}
              className="text-sm font-medium hover:underline leading-none"
            >
              {customer.full_name}
            </Link>
            {customer.flagged && (
              <span className="flex items-center gap-0.5 text-xs text-destructive mt-0.5">
                <Flag className="size-3" />
                Flagged
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => <CustomerTypeBadge type={row.original.customer_type as "online" | "walk_in"} />,
  },
  {
    id: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const { phone, email } = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          {phone && <span className="text-xs text-muted-foreground">{phone}</span>}
          {email && <span className="text-xs text-muted-foreground">{email}</span>}
          {!phone && !email && <span className="text-xs text-muted-foreground">—</span>}
        </div>
      );
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.is_active;
      return (
        <Badge className={active ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    sortingFn: "datetime",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{timeDiff(row.original.created_at)}</span>
    ),
  },
];
