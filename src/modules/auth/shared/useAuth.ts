"use client";
import { useAuthContext } from "@/providers/AuthProvider";
import { redirect, useRouter } from "next/navigation";

export const useAuth = () => {
  const { user, profile, isAuthenticated, isInitialized } = useAuthContext();
  if (isInitialized && !user) {
    redirect("/auth/login");
  }
  return { user, profile, isAuthenticated, isInitialized };
};
// readonly state
