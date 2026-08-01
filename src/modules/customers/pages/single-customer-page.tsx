"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ShoppingBag, Phone, Mail, StickyNote, User, Calendar, ShoppingCart } from "lucide-react";
import { useGetSingleCustomer } from "../hooks/use-get-single-customer";
import { CustomerDetailHeader } from "../components/customer-detail-header";
import { CustomerTypeBadge } from "../components/customer-type-badge";
import { timeDiff } from "@/shared/utils/time-diff";

const TABS = ["overview", "purchases"] as const;
type Tab = (typeof TABS)[number];

export default function SingleCustomerPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = (searchParams.get("tab") as Tab) ?? "overview";

  const handleTabChange = (tab: string) => {
    router.replace(`/customers/${params.id}?tab=${tab}`, { scroll: false });
  };

  const { data: customer, isPending, isError } = useGetSingleCustomer(params.id);

  // ── loading skeleton ───────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  // ── not found ──────────────────────────────────────────────────────
  if (isError || !customer) {
    return (
      <div className="flex items-center justify-center h-60 p-6">
        <p className="text-muted-foreground text-sm">Customer not found.</p>
      </div>
    );
  }

  const isOnline = customer.customer_type === "online";
  const membership = customer.profile?.membership;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* page header */}
      <CustomerDetailHeader customer={customer} />

      {/* tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full sm:w-auto max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>

        {/* ── overview tab ──────────────────────────────────────────── */}
        <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* contact info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-normal">Contact details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-3.5 text-muted-foreground shrink-0" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-3.5 text-muted-foreground shrink-0" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {!customer.phone && !customer.email && (
                  <span className="text-sm text-muted-foreground">No contact info on record</span>
                )}
              </CardContent>
            </Card>

            {/* account info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-normal">Account info</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-3.5 text-muted-foreground shrink-0" />
                  <CustomerTypeBadge type={customer.customer_type as "online" | "walk_in"} />
                </div>
                {/* membership — online customers only */}
                {isOnline && membership && (
                  <div className="flex items-center gap-2 text-sm">
                    <ShoppingBag className="size-3.5 text-muted-foreground shrink-0" />
                    <Badge variant="outline" className="capitalize text-xs">
                      {membership}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Added {timeDiff(customer.created_at)}</span>
                </div>
                {/* who created the walk-in customer */}
                {!isOnline && customer.created_by_profile?.full_name && (
                  <span className="text-xs text-muted-foreground">
                    Added by {customer.created_by_profile.full_name}
                  </span>
                )}
              </CardContent>
            </Card>

            {/* notes */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-normal flex items-center gap-1.5">
                  <StickyNote className="size-3.5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {customer.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes recorded</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* purchase stats — placeholder until orders module is built */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-normal">Purchase summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total orders", value: "—" },
                  { label: "Lifetime value", value: "—" },
                  { label: "Avg. order value", value: "—" },
                  { label: "Last purchase", value: "—" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                    <span className="text-lg font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Purchase data will be available once the orders module is connected.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── purchases tab ─────────────────────────────────────────── */}
        <TabsContent value="purchases" className="mt-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
              <ShoppingCart className="size-10 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">No purchases yet</p>
              <p className="text-xs text-muted-foreground max-w-xs text-center">
                Purchase history will appear here once the orders and POS sales modules are connected to customers.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
