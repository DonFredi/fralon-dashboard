"use client";
import { useAuth } from "@/modules/auth/shared/useAuth";
import { AppSidebar } from "@/shared/components/app-sidebar";
import Footer from "@/shared/components/layout/blocks/Footer";
import FullScreenLoader from "@/shared/components/layout/blocks/FullScreenLoader";
import Header from "@/shared/components/layout/blocks/Header";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) return <FullScreenLoader />;
  if (!isAuthenticated) return null;
  return (
    <SidebarProvider className="">
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <Header />
        <main className="flex flex-1 flex-col p-2 md:p-4">{children}</main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
