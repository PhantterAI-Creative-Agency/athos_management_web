"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMinistry } from "@/api-client/ministries";
import { deleteSchedule, listSchedules } from "@/api-client/ministrySchedules";
import { MinistryScheduleGuard } from "@/components/MinistryScheduleGuard";

type Tab = "proximas" | "passadas";

export default function MinistrySchedulesPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("proximas");

  const { data: ministry } = useQuery({ queryKey: ["ministries", id], queryFn: () => getMinistry(id) });

  const today = new Date().toISOString();
  const { data: schedules, isLoading } = useQuery({
    queryKey: ["ministry-schedules", id, tab],
    queryFn: () =>
      listSchedules(id, tab === "proximas" ? { from: today } : { to: today }),
  });

  const remove = useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(id, scheduleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ministry-schedules", id] }),
  });

  return (
    <MinistryScheduleGuard ministryId={id}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Escalas — {ministry?.name}</h2>
            <Link
              href={`/admin_athos/${churchSlug}/ministerios/${id}/funcoes`}
              className="text-sm text-accent"
            >
              Gerenciar funções
            </Link>
          </div>
          <Link
            href={`/admin_athos/${churchSlug}/ministerios/${id}/escalas/nova`}
            className="label-caps rounded-full bg-accent px-5 py-2 text-background"
          >
            Nova Escala
          </Link>
        </div>

        <div className="mb-4 flex gap-4 border-b border-divider">
          <button
            type="button"
            onClick={() => setTab("proximas")}
            className={`label-caps pb-2 ${tab === "proximas" ? "border-b-2 border-accent text-foreground" : "text-text-muted"}`}
          >
            Próximas
          </button>
          <button
            type="button"
            onClick={() => setTab("passadas")}
            className={`label-caps pb-2 ${tab === "passadas" ? "border-b-2 border-accent text-foreground" : "text-text-muted"}`}
          >
            Passadas
          </button>
        </div>

        {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

        <div className="flex flex-col gap-3">
          {schedules?.map((schedule) => (
            <div key={schedule.id} className="rounded-2xl bg-surface p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {new Date(schedule.date).toLocaleDateString("pt-BR")}
                    {schedule.title ? ` · ${schedule.title}` : ""}
                  </p>
                  <p className="text-xs text-text-muted">
                    {schedule.assignments.map((a) => `${a.functionName}: ${a.volunteerNames.join(", ") || "—"}`).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin_athos/${churchSlug}/ministerios/${id}/escalas/${schedule.id}`}
                    className="text-sm font-medium text-accent"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Excluir esta escala?")) remove.mutate(schedule.id);
                    }}
                    className="text-sm font-medium text-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}

          {schedules?.length === 0 && (
            <p className="text-sm text-text-muted">Nenhuma escala {tab === "proximas" ? "futura" : "passada"}.</p>
          )}
        </div>
      </div>
    </MinistryScheduleGuard>
  );
}
