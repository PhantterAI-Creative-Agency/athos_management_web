"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getMyChurch } from "@/api-client/churches";
import { hasRole, isAdmin, isDevAdmin } from "@/lib/rbac";
import { PageLoader } from "./ui/PageLoader";

// Rota de escalas/funções de ministério é a única exceção liberada pro papel
// ministryLeader dentro do admin_athos — o resto continua exclusivo de admin/devAdmin.
// A checagem fina de "é líder DESTE ministério" acontece em MinistryScheduleGuard,
// dentro das próprias páginas dessa rota.
const MINISTRY_SCHEDULE_ROUTE = /\/ministerios\/[^/]+\/(escalas|funcoes)(\/|$)/;

export function AdminGuard({
  churchSlug,
  children,
}: {
  churchSlug: string;
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isMinistryScheduleRoute = MINISTRY_SCHEDULE_ROUTE.test(pathname ?? "");
  const allowed =
    !isLoading &&
    !!user &&
    (isAdmin(user) || (isMinistryScheduleRoute && hasRole(user, "ministryLeader")));

  const { data: church, isLoading: isLoadingChurch } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
    enabled: allowed,
  });

  const slugMatches = isDevAdmin(user) || !church || church.slug === churchSlug;

  useEffect(() => {
    if (isLoading) return;
    if (!user || !(isAdmin(user) || (isMinistryScheduleRoute && hasRole(user, "ministryLeader")))) {
      router.replace("/home");
      return;
    }
    if (church && !slugMatches) {
      router.replace(`/admin_athos/${church.slug}`);
    }
  }, [isLoading, user, church, slugMatches, router, isMinistryScheduleRoute]);

  if (isLoading || !allowed || isLoadingChurch || !slugMatches) return <PageLoader />;

  return <>{children}</>;
}
