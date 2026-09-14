"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMinistry, getServiceFunctions, replaceServiceFunctions } from "@/api-client/ministries";
import { MinistryScheduleGuard } from "@/components/MinistryScheduleGuard";
import { ServiceFunctionsForm } from "@/components/admin/ServiceFunctionsForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function MinistryServiceFunctionsPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: ministry } = useQuery({ queryKey: ["ministries", id], queryFn: () => getMinistry(id) });
  const { data: functions, isLoading } = useQuery({
    queryKey: ["ministry-service-functions", id],
    queryFn: () => getServiceFunctions(id),
  });

  const mutation = useMutation({
    mutationFn: (data: { id?: string; name: string }[]) => replaceServiceFunctions(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-service-functions", id] });
      router.push(`/admin_athos/${churchSlug}/ministerios/${id}/escalas`);
    },
  });

  return (
    <MinistryScheduleGuard ministryId={id}>
      <div className="mx-auto max-w-2xl">
        <FormPageHeader
          title={`Funções — ${ministry?.name ?? ""}`}
          backHref={`/admin_athos/${churchSlug}/ministerios/${id}/escalas`}
          backLabel="Escalas"
        />
        <p className="mb-4 text-sm text-text-muted">
          Defina as funções que compõem a escala deste ministério (ex.: Instrumento, Vocal, Mesa,
          Datashow). Cada função pode receber mais de um voluntário na escala.
        </p>
        {isLoading || !functions ? (
          <p className="text-sm text-text-muted">Carregando...</p>
        ) : (
          <ServiceFunctionsForm
            initialFunctions={functions}
            onSubmit={(data) => mutation.mutate(data)}
            isSubmitting={mutation.isPending}
          />
        )}
      </div>
    </MinistryScheduleGuard>
  );
}
