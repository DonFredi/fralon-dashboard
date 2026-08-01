"use client";
import { Flag, FlagOff, TriangleAlert } from "lucide-react";
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
import { useFlagCustomer } from "../hooks/use-flag-customer";

interface Props {
  customerId: string;
  isFlagged: boolean;
  customerName: string;
}

export function CustomerFlagButton({ customerId, isFlagged, customerName }: Props) {
  const { mutate, isPending } = useFlagCustomer(customerId);

  // ── Already flagged — offer to remove ──────────────────────────────
  if (isFlagged) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            <FlagOff className="size-4" />
            Remove flag
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove flag from {customerName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear the flag. Staff will no longer see a warning on this customer's
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutate(false)}>Remove flag</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // ── Not flagged — destructive flag action ───────────────────────────
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          className="gap-2"
        >
          <Flag className="size-4" />
          Flag customer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* warning icon + title together for maximum danger feel */}
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <TriangleAlert className="size-5 text-destructive" />
            </span>
            <div className="space-y-1">
              <AlertDialogTitle>Flag {customerName}?</AlertDialogTitle>
              <AlertDialogDescription>
                Flagging marks this customer as problematic or notorious. This is a{" "}
                <strong>visible warning</strong> displayed to all staff when viewing or serving this
                customer. It does not block them from purchasing, but alerts your team to handle
                them with caution.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(true)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Flag this customer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
