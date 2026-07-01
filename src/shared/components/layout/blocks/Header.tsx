"use client";
import { BellIcon, PowerIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { Separator } from "../../ui/separator";
import { SidebarTrigger } from "../../ui/sidebar";
import { useAuth } from "@/modules/auth/shared/useAuth";
import LogoutButton from "@/modules/auth/logout/components/LogoutButton";

export default function Header() {
  const { profile } = useAuth();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 pr-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-centersss">
        <small className="text-muted-foreground border border-border rounded-full px-3 py-0.5">{profile?.role}</small>
        <LogoutButton>
          <PowerIcon className="size-5" />
        </LogoutButton>
      </div>
    </header>
  );
}
