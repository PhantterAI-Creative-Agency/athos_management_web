"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDevotional, updateDevotional } from "@/api-client/devotionals";
import { DevotionalForm } from "@/components/admin/DevotionalForm";

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
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Editar Devocional</h2>
      <DevotionalForm
        initialDevotional={devotional}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
