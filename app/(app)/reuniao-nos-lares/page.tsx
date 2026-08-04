"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "@/components/ui/Tag";
import { AuthGuard } from "@/components/AuthGuard";
import { useChurchSettings } from "@/hooks/useChurchSettings";
import { listGrowthGroups } from "@/api-client/growthGroups";

function GcContent() {
  const { growthGroupName } = useChurchSettings();
  const [tab, setTab] = useState("Todos");

  const { data: allGroups } = useQuery({
    queryKey: ["growth-groups", "all"],
    queryFn: () => listGrowthGroups(false),
  });

  const { data: myGroups } = useQuery({
    queryKey: ["growth-groups", "mine"],
    queryFn: () => listGrowthGroups(true),
    enabled: tab === "Meus",
  });

  const groups = tab === "Meus" ? myGroups : allGroups;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">{growthGroupName}</h2>
      <p className="mb-5 hidden text-sm text-text-muted md:block">
        Conecte-se com irmãos da sua igreja
      </p>

      <div className="mb-5 md:w-fit">
        <SegmentedControl options={["Todos", "Meus"]} onChange={setTab} />
      </div>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {groups?.map((group) => (
          <div key={group.id} className="overflow-hidden rounded-2xl bg-surface">
            <CoverImage
              label={group.name}
              seed={`gc-${group.id}`}
              className="h-[100px]"
            />
            <div className="p-4">
              <p className="mb-1.5 font-semibold leading-tight">{group.name}</p>
              <p className="mb-2 text-xs text-text-muted">Líder: {group.leaderName}</p>
              <div className="mb-2 flex flex-wrap gap-1.5">
                <Tag>{group.membersIds.length} membros</Tag>
                {group.indicators.attendanceRate > 0 && (
                  <Tag>{group.indicators.attendanceRate}% frequência</Tag>
                )}
              </div>
              {group.hasPendencies && (
                <p className="text-xs text-amber-600">Pendências pendentes</p>
              )}
            </div>
          </div>
        ))}
        {groups?.length === 0 && (
          <p className="col-span-full text-center text-sm text-text-muted">
            Nenhum grupo encontrado
          </p>
        )}
      </div>
    </div>
  );
}

export default function GcPage() {
  return (
    <AuthGuard>
      <AppShell active="/reuniao-nos-lares">
        <GcContent />
      </AppShell>
    </AuthGuard>
  );
}
