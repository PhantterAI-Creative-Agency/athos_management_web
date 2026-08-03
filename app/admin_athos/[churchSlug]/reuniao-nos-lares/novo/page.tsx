"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGrowthGroup } from "@/api-client/growthGroups";
import { GrowthGroupForm } from "@/components/admin/GrowthGroupForm";

export default function NewGrowthGroupPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGrowthGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["growthGroups"] });
      router.push(`/admin_athos/${churchSlug}/reuniao-nos-lares`);
    },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Novo Grupo</h2>
      <GrowthGroupForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
