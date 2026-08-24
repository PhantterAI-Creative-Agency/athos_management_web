"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "@/components/ui/Tag";
import { useAuth } from "@/hooks/useAuth";
import { listMinistries } from "@/api-client/ministries";
import { getMyChurch } from "@/api-client/churches";
import { canManageMinistrySchedule, canViewMinistryVolunteerCount } from "@/lib/rbac";

function MinisteriosContent() {
  const { user } = useAuth();

  const { data: ministries } = useQuery({
    queryKey: ["ministries", user?.id],
    queryFn: () => listMinistries(user?.id),
    enabled: !!user?.id,
  });

  const { data: church } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
    enabled: !!user,
  });

  const volunteerMinistries = ministries?.filter((m) => m.isVolunteer);
  const otherMinistries = ministries?.filter((m) => !m.isVolunteer);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Ministérios</h2>
      <p className="mb-5 text-sm text-text-muted">Encontre seu lugar e sirva com alegria</p>

      {volunteerMinistries && volunteerMinistries.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
            Seus Ministérios
          </h3>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {volunteerMinistries.map((ministry) => (
              <div key={ministry.id} className="overflow-hidden rounded-2xl bg-surface ring-2 ring-accent/30">
                <CoverImage
                  label={ministry.name}
                  seed={`ministry-${ministry.id}`}
                  className="h-[100px]"
                />
                <div className="p-4">
                  <p className="mb-1.5 font-semibold leading-tight">{ministry.name}</p>
                  <Tag>Voluntário</Tag>
                  {church && canManageMinistrySchedule(user, ministry.id) && (
                    <Link
                      href={`/admin_athos/${church.slug}/ministerios/${ministry.id}/escalas`}
                      className="mt-2 block text-sm font-medium text-accent"
                    >
                      Gerenciar escalas
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
        Todos os Ministérios
      </h3>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {(otherMinistries || ministries)?.map((ministry) => (
          <div key={ministry.id} className="overflow-hidden rounded-2xl bg-surface">
            <CoverImage
              label={ministry.name}
              seed={`ministry-${ministry.id}`}
              className="h-[100px]"
            />
            <div className="p-4">
              <p className="mb-1.5 font-semibold leading-tight">{ministry.name}</p>
              {canViewMinistryVolunteerCount(user, ministry.id) && (
                <div className="flex flex-wrap gap-1.5">
                  <Tag>{ministry.participantsCount} voluntários</Tag>
                </div>
              )}
              {church && canManageMinistrySchedule(user, ministry.id) && (
                <Link
                  href={`/admin_athos/${church.slug}/ministerios/${ministry.id}/escalas`}
                  className="mt-2 block text-sm font-medium text-accent"
                >
                  Gerenciar escalas
                </Link>
              )}
            </div>
          </div>
        ))}
        {ministries?.length === 0 && (
          <p className="col-span-full text-center text-sm text-text-muted">
            Nenhum ministério encontrado
          </p>
        )}
      </div>
    </div>
  );
}

export default function MinisteriosPage() {
  return (
    <AppShell active="/ministerios">
      <MinisteriosContent />
    </AppShell>
  );
}
