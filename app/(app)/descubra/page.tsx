"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { useAuth } from "@/hooks/useAuth";
import { listPlans } from "@/api-client/plans";
import { listMinistries } from "@/api-client/ministries";
import { canViewMinistryVolunteerCount } from "@/lib/rbac";

function DescubraContent() {
  const { user } = useAuth();

  const { data: plans } = useQuery({
    queryKey: ["plans", "discover"],
    queryFn: () => listPlans("find"),
  });

  const { data: ministries } = useQuery({
    queryKey: ["ministries"],
    queryFn: () => listMinistries(),
  });

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Descubra</h2>
      <p className="mb-5 text-sm text-text-muted">Explore planos, ministérios e mais</p>

      {plans && plans.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
              Planos de Leitura
            </h3>
          </div>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
            {plans.map((plan) => (
              <div key={plan.id} className="w-[200px] flex-none">
                <CoverImage
                  label={plan.title}
                  seed={`plan-${plan.id}`}
                  className="mb-2 h-[120px]"
                />
                <p className="text-sm font-semibold leading-tight">{plan.title}</p>
                <p className="text-[10px] text-text-muted">{plan.durationDays} dias</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {ministries && ministries.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
              Ministérios
            </h3>
          </div>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
            {ministries.slice(0, 6).map((ministry) => (
              <div key={ministry.id} className="w-[160px] flex-none">
                <CoverImage
                  label={ministry.name}
                  seed={`ministry-${ministry.id}`}
                  className="mb-2 h-[100px]"
                />
                <p className="text-sm font-semibold leading-tight">{ministry.name}</p>
                {canViewMinistryVolunteerCount(user, ministry.id) && (
                  <p className="text-[10px] text-text-muted">{ministry.participantsCount} voluntários</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {ministries?.length === 0 && plans?.length === 0 && (
        <p className="text-center text-sm text-text-muted">Nada para descobrir ainda</p>
      )}
    </div>
  );
}

export default function DescubraPage() {
  return (
    <AppShell active="/descubra">
      <DescubraContent />
    </AppShell>
  );
}
