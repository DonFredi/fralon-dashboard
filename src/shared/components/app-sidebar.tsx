"use client";

import * as React from "react";

import { NavMain } from "@/shared/components/nav-main";
import { NavSecondary } from "@/shared/components/nav-secondary";
import { NavUser } from "@/shared/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  ShelvingUnitIcon,
  ShoppingCartIcon,
  PackageIcon,
  BanknoteArrowUpIcon,
  ArrowRightLeft,
  HousePlugIcon,
  ContactRoundIcon,
  CommandIcon,
} from "lucide-react";
import { useAuth } from "@/modules/auth/shared/useAuth";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: <UsersIcon />,
    },
    {
      title: "Products",
      url: "/products",
      icon: <PackageIcon />,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: <ArrowRightLeft />,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: <BanknoteArrowUpIcon />,
    },
    {
      title: "Operations",
      url: "/operations",
      icon: <HousePlugIcon />,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: <ShelvingUnitIcon />,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: <ContactRoundIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Fralon Inc.</span>
              </a>
            </SidebarMenuButton>
            <SidebarTrigger className="md:hidden" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: profile?.full_name ?? "Unknown",
            email: profile?.email ?? "",
            avatar: profile?.avatar_url ?? "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
