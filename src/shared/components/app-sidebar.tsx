"use client";

import * as React from "react";

import { NavDocuments } from "@/shared/components/nav-documents";
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
} from "@/shared/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
  ShelvingUnitIcon,
  ShoppingCartIcon,
  PackageIcon,
  BanknoteArrowUpIcon,
  ArrowRightLeft,
  HousePlugIcon,
  ContactRoundIcon,
} from "lucide-react";
import { useAuth } from "@/modules/auth/shared/useAuth";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  navClouds: [
    {
      title: "Capture",
      icon: <CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
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
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <FileIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Fralon Inc.</span>
              </a>
              {/* <Badge /> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: profile?.full_name, email: profile?.email, avatar: profile?.avatar_url || "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
