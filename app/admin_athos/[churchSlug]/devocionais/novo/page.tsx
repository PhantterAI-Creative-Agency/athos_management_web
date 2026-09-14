"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevotional } from "@/api-client/devotionals";
import { DevotionalForm } from "@/components/admin/DevotionalForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function NewDevotionalPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDevotional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devotionals"] });
      router.push(`/admin_athos/${churchSlug}/devocionais`);
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Novo Devocional"
        backHref={`/admin_athos/${churchSlug}/devocionais`}
        backLabel="Devocionais"
      />
      <DevotionalForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
