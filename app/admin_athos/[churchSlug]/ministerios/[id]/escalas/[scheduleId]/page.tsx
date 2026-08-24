"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServiceFunctions, listMinistryVolunteers } from "@/api-client/ministries";
import { deleteSchedule, getSchedule, updateSchedule } from "@/api-client/ministrySchedules";
import { listUsers } from "@/api-client/users";
import { MinistryScheduleGuard } from "@/components/MinistryScheduleGuard";
import { MinistryScheduleForm } from "@/components/admin/MinistryScheduleForm";

export default function EditMinistrySchedulePage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string; scheduleId: string }>;
}) {
  const { churchSlug, id, scheduleId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: schedule } = useQuery({
    queryKey: ["ministry-schedules", id, scheduleId],
    queryFn: () => getSchedule(id, scheduleId),
  });
  const { data: serviceFunctions } = useQuery({
    queryKey: ["ministry-service-functions", id],
    queryFn: () => getServiceFunctions(id),
  });
  const { data: volunteers } = useQuery({
    queryKey: ["ministry-volunteers", id],
    queryFn: () => listMinistryVolunteers(id),
  });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => listUsers() });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateSchedule>[2]) => updateSchedule(id, scheduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-schedules", id] });
      router.push(`/admin_athos/${churchSlug}/ministerios/${id}/escalas`);
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteSchedule(id, scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-schedules", id] });
      router.push(`/admin_athos/${churchSlug}/ministerios/${id}/escalas`);
    },
  });

  const volunteerNames = Object.fromEntries((users ?? []).map((u) => [u.id, u.name]));

  return (
    <MinistryScheduleGuard ministryId={id}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Editar Escala</h2>
          <button
            type="button"
            onClick={() => {
              if (confirm("Excluir esta escala?")) remove.mutate();
            }}
            className="text-sm font-medium text-red-600"
          >
            Excluir
          </button>
        </div>
        {!schedule || !serviceFunctions || !volunteers ? (
          <p className="text-sm text-text-muted">Carregando...</p>
        ) : (
          <MinistryScheduleForm
            serviceFunctions={serviceFunctions}
            volunteers={volunteers}
            volunteerNames={volunteerNames}
            initialSchedule={schedule}
            onSubmit={(data) => mutation.mutate(data)}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </MinistryScheduleGuard>
  );
}
