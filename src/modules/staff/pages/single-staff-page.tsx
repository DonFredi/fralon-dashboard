"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Calendar, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetSingleStaff } from "../hooks/use-get-single-staff";
import { StaffActionButtons } from "../components/staff-action-buttons";
import { useAuth } from "@/modules/auth/shared/useAuth";
import { timeDiff } from "@/shared/utils/time-diff";

// static capabilities list — designed to be configurable later
// when role-based access within staff is introduced
const CAPABILITIES = [
  { label: "View all customers", allowed: true },
  { label: "Add walk-in customers", allowed: true },
  { label: "View and update products", allowed: true },
  { label: "Process POS sales", allowed: true },
  { label: "Process operations", allowed: true },
  { label: "Apply discounts", allowed: false },
  { label: "Cancel orders", allowed: false },
  { label: "Process refunds", allowed: false },
  { label: "Access staff management", allowed: false },
  { label: "Access settings", allowed: false },
];

export default function SingleStaffPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAdmin, isInitialized } = useAuth();

  // admin-only guard
  useEffect(() => {
    if (isInitialized && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, isInitialized, router]);

  const { data: staff, isPending, isError } = useGetSingleStaff(params.id);

  // ── loading skeleton ───────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isError || !staff) {
    return (
      <div className="flex items-center justify-center h-60 p-6">
        <p className="text-muted-foreground text-sm">Staff member not found.</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const initials = staff.full_name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* back link */}
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2 text-muted-foreground">
        <Link href="/staff">
          <ArrowLeft className="size-4" />
          Back to staff
        </Link>
      </Button>

      {/* header */}
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full bg-muted overflow-hidden flex items-center justify-center text-base font-semibold text-muted-foreground">
          {staff.avatar_url ? (
            <img src={staff.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold leading-none">{staff.full_name}</h1>
            <Badge
              className={
                staff.is_active
                  ? "bg-success/10 text-success border-0"
                  : "bg-destructive/10 text-destructive border-0"
              }
            >
              {staff.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{staff.email}</span>
        </div>
      </div>

      {/* info + capabilities cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* contact + account info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Staff details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {staff.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-3.5 text-muted-foreground shrink-0" />
                <span>{staff.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-3.5 text-muted-foreground shrink-0" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground text-xs">
                Staff since {timeDiff(staff.updated_at)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* capabilities — static for now, configurable later */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {CAPABILITIES.map((cap) => (
                <li key={cap.label} className="flex items-center gap-2 text-xs">
                  {cap.allowed ? (
                    <Check className="size-3.5 text-success shrink-0" />
                  ) : (
                    <X className="size-3.5 text-muted-foreground/50 shrink-0" />
                  )}
                  <span className={cap.allowed ? "" : "text-muted-foreground"}>
                    {cap.label}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* danger zone */}
      <StaffActionButtons staff={staff} />
    </div>
  );
}
