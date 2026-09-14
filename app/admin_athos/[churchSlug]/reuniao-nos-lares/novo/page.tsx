"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGrowthGroup } from "@/api-client/growthGroups";
import { GrowthGroupForm } from "@/components/admin/GrowthGroupForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

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
      <FormPageHeader
        title="Novo Grupo"
        backHref={`/admin_athos/${churchSlug}/reuniao-nos-lares`}
        backLabel="Reunião nos Lares"
      />
      <GrowthGroupForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
