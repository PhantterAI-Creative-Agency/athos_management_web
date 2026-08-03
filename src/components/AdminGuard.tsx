"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getMyChurch } from "@/api-client/churches";
import { isAdmin, isDevAdmin } from "@/lib/rbac";
import { PageLoader } from "./ui/PageLoader";

export function AdminGuard({
  churchSlug,
  children,
}: {
  churchSlug: string;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const allowed = !isLoading && !!user && isAdmin(user);

  const { data: church, isLoading: isLoadingChurch } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
    enabled: allowed,
  });

  const slugMatches = isDevAdmin(user) || !church || church.slug === churchSlug;

  useEffect(() => {
    if (isLoading) return;
    if (!user || !isAdmin(user)) {
      router.replace("/home");
      return;
    }
    if (church && !slugMatches) {
      router.replace(`/admin_athos/${church.slug}`);
    }
  }, [isLoading, user, church, slugMatches, router]);

  if (isLoading || !allowed || isLoadingChurch || !slugMatches) return <PageLoader />;

  return <>{children}</>;
}
