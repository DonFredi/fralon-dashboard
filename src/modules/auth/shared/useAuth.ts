"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();
  const { user, profile, isAuthenticated, isInitialized } = useAuthContext();

  useEffect(() => {
    if (isInitialized && (!user || !profile)) {
      router.replace("/auth/login");
    }
  }, [isInitialized, user, profile, router]);
  return { user, profile, isAuthenticated, isInitialized };
};
// readonly state
