"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDevotional, updateDevotional } from "@/api-client/devotionals";
import { DevotionalForm } from "@/components/admin/DevotionalForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function EditDevotionalPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: devotional, isLoading } = useQuery({
    queryKey: ["devotionals", id],
    queryFn: () => getDevotional(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateDevotional>[1]) => updateDevotional(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotionals"] });
      router.push(`/admin_athos/${churchSlug}/devocionais`);
    },
  });

  if (isLoading || !devotional) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Editar Devocional"
        backHref={`/admin_athos/${churchSlug}/devocionais`}
        backLabel="Devocionais"
      />
      <DevotionalForm
        initialDevotional={devotional}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
