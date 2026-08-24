"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServiceFunctions, listMinistryVolunteers } from "@/api-client/ministries";
import { createSchedule } from "@/api-client/ministrySchedules";
import { listUsers } from "@/api-client/users";
import { MinistryScheduleGuard } from "@/components/MinistryScheduleGuard";
import { MinistryScheduleForm } from "@/components/admin/MinistryScheduleForm";

export default function NewMinistrySchedulePage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

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
    mutationFn: (data: Parameters<typeof createSchedule>[1]) => createSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-schedules", id] });
      router.push(`/admin_athos/${churchSlug}/ministerios/${id}/escalas`);
    },
  });

  const volunteerNames = Object.fromEntries((users ?? []).map((u) => [u.id, u.name]));

  return (
    <MinistryScheduleGuard ministryId={id}>
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-5 text-2xl font-semibold">Nova Escala</h2>
        {!serviceFunctions || !volunteers ? (
          <p className="text-sm text-text-muted">Carregando...</p>
        ) : (
          <MinistryScheduleForm
            serviceFunctions={serviceFunctions}
            volunteers={volunteers}
            volunteerNames={volunteerNames}
            onSubmit={(data) => mutation.mutate(data)}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </MinistryScheduleGuard>
  );
}
