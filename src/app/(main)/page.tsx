"use client";
import { useAuth } from "@/modules/auth/shared/useAuth";
import StatusBadge from "@/modules/products/components/StatusBadge";
import PageWrapper from "@/shared/components/layout/blocks/PageWrapper";
import SectionWrapper from "@/shared/components/layout/blocks/SectionWrapper";
import { H4, H5, P } from "@/shared/components/layout/typography/Typography";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { profile: user } = useAuth();
  return (
    <PageWrapper>
      <SectionWrapper className="flex items-center gap-5">
        <Button onClick={() => router.push("/auth/login")}>Login</Button>
        <Button variant="secondary" onClick={() => router.push("/auth/register")}>
          Register
        </Button>
      </SectionWrapper>
      <SectionWrapper>
        <div className="flex flex-col gap-1.5 w-fit p-6 rounded-xl border border-foreground-border">
          <small className="text-caption-sm text-foreground-caption">{user?.id}</small>
          <H4>{user?.email}</H4>
          <H5>{user?.full_name}</H5>
          <StatusBadge status={user?.is_active ? "active" : "inactive"} />
        </div>
      </SectionWrapper>
      <SectionWrapper>Hero Section</SectionWrapper>
      <SectionWrapper>Products</SectionWrapper>
      <SectionWrapper>Services</SectionWrapper>
      <SectionWrapper>Call to Action</SectionWrapper>
    </PageWrapper>
  );
}
