"use client";
import { useAuth } from "@/modules/auth/shared/useAuth";
import FullScreenLoader from "@/shared/components/layout/blocks/FullScreenLoader";
import SectionWrapper from "@/shared/components/layout/blocks/SectionWrapper";
import Copyright from "@/shared/components/layout/typography/Copyright";
import Badge from "@/shared/components/shared/Badge";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  useEffect(() => {
    if (!isInitialized) return;
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) return <FullScreenLoader />;
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex-1 flex flex-col">
      <header className="">
        <SectionWrapper className="">
          <Badge />
        </SectionWrapper>
      </header>
      <main className="flex flex-col flex-1 gap-x-10 items-center justify-center">{children}</main>
      <footer className="">
        <SectionWrapper className="text-center">
          <Copyright />
        </SectionWrapper>
      </footer>
    </div>
  );
}
