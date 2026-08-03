"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGrowthGroup, updateGrowthGroup } from "@/api-client/growthGroups";
import { GrowthGroupForm } from "@/components/admin/GrowthGroupForm";

export default function EditGrowthGroupPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: group, isLoading } = useQuery({
    queryKey: ["growthGroups", id],
    queryFn: () => getGrowthGroup(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateGrowthGroup>[1]) => updateGrowthGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["growthGroups"] });
      router.push(`/admin_athos/${churchSlug}/reuniao-nos-lares`);
    },
  });

  if (isLoading || !group) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Editar Grupo</h2>
      <GrowthGroupForm
        initialGroup={group}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
