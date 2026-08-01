"use client";
/* import * as Sentry from "@sentry/nextjs"; */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/shared/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import FullScreenLoader from "@/shared/components/layout/blocks/FullScreenLoader";
import type { Profile } from "@/modules/profile/update-profile/update-profile.types";

type AuthContextType = {
  user: SupabaseUser | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single<Profile>();

    // account has been deactivated — sign out immediately
    if (data && !data.is_active) {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchProfile(user.id);
        /* Sentry.setUser({ id: user.id, email: user.email }); */
      }
      setIsInitialized(true);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        /* Sentry.setUser({ id: session.user.id, email: session.user.email }); */
      } else {
        setProfile(null);
        /* Sentry.setUser(null); */
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated: !!user, isInitialized }}>
      {/* prevent flicker */}
      {!isInitialized ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within the AuthProvider");
  }
  return context;
};
