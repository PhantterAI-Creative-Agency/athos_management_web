"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMinistry, updateMinistry } from "@/api-client/ministries";
import { MinistryForm } from "@/components/admin/MinistryForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function EditMinistryPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: ministry, isLoading } = useQuery({
    queryKey: ["ministries", id],
    queryFn: () => getMinistry(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateMinistry>[1]) => updateMinistry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      router.push(`/admin_athos/${churchSlug}/ministerios`);
    },
  });

  if (isLoading || !ministry) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Editar Ministério"
        backHref={`/admin_athos/${churchSlug}/ministerios`}
        backLabel="Ministérios"
      />
      <MinistryForm
        initialMinistry={ministry}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
