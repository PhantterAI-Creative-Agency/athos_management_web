"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { canManageMinistrySchedule } from "@/lib/rbac";
import { PageLoader } from "./ui/PageLoader";

export function MinistryScheduleGuard({
  ministryId,
  children,
}: {
  ministryId: string;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const allowed = !isLoading && !!user && canManageMinistrySchedule(user, ministryId);

  useEffect(() => {
    if (isLoading) return;
    if (!allowed) router.replace("/home");
  }, [isLoading, allowed, router]);

  if (isLoading || !allowed) return <PageLoader />;

  return <>{children}</>;
}
