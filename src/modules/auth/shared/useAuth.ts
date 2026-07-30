"use client";
import { useAuthContext } from "@/providers/AuthProvider";

export const useAuth = () => {
  const { user, profile, isAuthenticated, isInitialized } = useAuthContext();

  const isAdmin = profile?.role === "admin";
  const isStaff = profile?.role === "staff";

  return { user, profile, isAuthenticated, isInitialized, isAdmin, isStaff };
};
// readonly state
