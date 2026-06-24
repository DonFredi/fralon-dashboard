"use client";
import { Button } from "@/shared/components/ui/button";
import { Activity, type ReactNode } from "react";
import { useLogout } from "../useLogout";
import { useRouter } from "next/navigation";
import { useAuth } from "../../shared/useAuth";

export default function LogoutButton({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogout();
  const { isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await mutateAsync();
      router.replace("/auth/login");
    } catch (error) {
      console.log("hande out error", error);
    }
  };

  return (
    <Activity mode={isAuthenticated ? "visible" : "hidden"}>
      <Button
        disabled={isPending}
        onClick={handleLogout}
        variant="ghost"
        className="py-2 px-4 text-destructive hover:bg-red-200 hover:text-destructive"
      >
        {isPending && <small>Logging out</small>}
        {children}
      </Button>
    </Activity>
  );
}
