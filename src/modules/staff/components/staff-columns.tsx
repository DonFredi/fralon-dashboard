"use client";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { timeDiff } from "@/shared/utils/time-diff";
import type { StaffMember } from "../types/staff.types";

export const staffColumns: ColumnDef<StaffMember>[] = [
  {
    id: "name",
    header: "Staff member",
    cell: ({ row }) => {
      const staff = row.original;
      const initials = staff.full_name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground overflow-hidden">
            {staff.avatar_url ? (
              <img src={staff.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-col">
            <Link
              href={`/staff/${staff.id}`}
              className="text-sm font-medium hover:underline leading-none"
            >
              {staff.full_name}
            </Link>
            <span className="text-xs text-muted-foreground mt-0.5">{staff.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    id: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.phone ?? "—"}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.is_active;
      return (
        <Badge
          className={
            active
              ? "bg-success/10 text-success border-0"
              : "bg-destructive/10 text-destructive border-0"
          }
        >
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "joined",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {timeDiff(row.original.updated_at)}
      </span>
    ),
  },
];
