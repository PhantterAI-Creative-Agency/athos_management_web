"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CoverImage } from "@/components/ui/CoverImage";
import { AuthGuard } from "@/components/AuthGuard";
import { listPlans, upsertPlanProgress } from "@/api-client/plans";

const TABS = ["Descobrir", "Meus", "Salvos", "Concluídos"];
const TAB_MAP: Record<string, string | undefined> = {
  Descobrir: "find",
  Meus: "mine",
  Salvos: "saved",
  Concluídos: "completed",
};

function PlanosContent() {
  const [tab, setTab] = useState("Descobrir");
  const queryClient = useQueryClient();

  const { data: plans } = useQuery({
    queryKey: ["plans", TAB_MAP[tab]],
    queryFn: () => listPlans(TAB_MAP[tab]),
  });

  const startMutation = useMutation({
    mutationFn: (planId: string) => upsertPlanProgress(planId, { status: "in_progress", currentDay: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plans"] }),
  });

  const saveMutation = useMutation({
    mutationFn: (planId: string) => upsertPlanProgress(planId, { status: "saved" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plans"] }),
  });

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Planos de Leitura</h2>
      <p className="mb-5 text-sm text-text-muted">Leia a Bíblia de forma estruturada</p>

      <div className="mb-5 md:w-fit">
        <SegmentedControl options={TABS} onChange={setTab} />
      </div>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => {
          const totalDays = plan.progress?.totalDays || plan.durationDays;
          const currentDay = plan.progress?.currentDay || 0;
          const progress = totalDays > 0 ? Math.round((currentDay / totalDays) * 100) : 0;

          return (
            <div key={plan.id} className="overflow-hidden rounded-2xl bg-surface">
              <CoverImage
                label={plan.title}
                seed={`plan-${plan.id}`}
                className="h-[120px]"
              />
              <div className="p-4">
                <p className="mb-1 font-semibold leading-tight">{plan.title}</p>
                <p className="mb-2 text-xs text-text-muted">
                  {plan.durationDays} dias
                  {plan.themes?.length > 0 && ` · ${plan.themes.join(", ")}`}
                </p>

                {plan.progress && (
                  <div className="mb-3">
                    <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-text-muted">
                      {currentDay}/{totalDays} dias ({progress}%)
                    </p>
                  </div>
                )}

                {!plan.progress && tab === "Descobrir" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startMutation.mutate(plan.id)}
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Começar
                    </button>
                    <button
                      type="button"
                      onClick={() => saveMutation.mutate(plan.id)}
                      className="rounded-lg bg-background px-3 py-1.5 text-xs font-medium"
                    >
                      Salvar
                    </button>
                  </div>
                )}

                {plan.progress?.status === "completed" && (
                  <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Concluído
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {plans?.length === 0 && (
          <p className="col-span-full text-center text-sm text-text-muted">
            Nenhum plano encontrado
          </p>
        )}
      </div>
    </div>
  );
}

export default function PlanosPage() {
  return (
    <AuthGuard>
      <AppShell active="/planos">
        <PlanosContent />
      </AppShell>
    </AuthGuard>
  );
}
