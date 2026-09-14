"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMinistry } from "@/api-client/ministries";
import { MinistryForm } from "@/components/admin/MinistryForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function NewMinistryPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createMinistry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministries"] });
      router.push(`/admin_athos/${churchSlug}/ministerios`);
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Novo Ministério"
        backHref={`/admin_athos/${churchSlug}/ministerios`}
        backLabel="Ministérios"
      />
      <MinistryForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
