"use client";
import { useRouter } from "next/navigation";
import { TriangleAlert, UserMinus, PowerOff, Power } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { useToggleStaffActive } from "../hooks/use-toggle-staff-active";
import { useDemoteStaff } from "../hooks/use-demote-staff";
import type { StaffMember } from "../types/staff.types";

interface Props {
  staff: StaffMember;
}

export function StaffActionButtons({ staff }: Props) {
  const router = useRouter();
  const { mutate: toggleActive, isPending: isTogglingActive } = useToggleStaffActive(staff.id);
  const { mutate: demote, isPending: isDemoting } = useDemoteStaff(staff.id);

  const handleDemote = () => {
    demote(undefined, {
      onSuccess: () => router.push("/staff"),
    });
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
      <div>
        <h3 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
          <TriangleAlert className="size-4" />
          Danger zone
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          These actions are irreversible or have significant consequences. Proceed with caution.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* ── deactivate / reactivate ──────────────────────────── */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={staff.is_active ? "outline" : "default"}
              size="sm"
              disabled={isTogglingActive}
              className={staff.is_active ? "border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive" : ""}
            >
              {staff.is_active ? (
                <>
                  <PowerOff className="size-4" />
                  Deactivate account
                </>
              ) : (
                <>
                  <Power className="size-4" />
                  Reactivate account
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {staff.is_active ? "Deactivate" : "Reactivate"} {staff.full_name}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {staff.is_active
                  ? "This will immediately sign them out and block access to the dashboard. Their account and data are preserved — you can reactivate at any time."
                  : "This will restore their access to the dashboard immediately."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => toggleActive(!staff.is_active)}
                className={
                  staff.is_active
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : ""
                }
              >
                {staff.is_active ? "Deactivate" : "Reactivate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ── demote to customer ───────────────────────────────── */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDemoting}
            >
              <UserMinus className="size-4" />
              Demote to customer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <TriangleAlert className="size-5 text-destructive" />
                </span>
                <div className="space-y-1">
                  <AlertDialogTitle>Demote {staff.full_name} to customer?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately revoke their staff access. They will lose access to the
                    dashboard and all staff capabilities. They will be redirected to the client
                    storefront on their next login. This action cannot be undone from this page —
                    you would need to promote them again.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDemote}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Demote to customer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
