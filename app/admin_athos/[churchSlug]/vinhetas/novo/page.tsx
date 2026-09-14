"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJingle } from "@/api-client/jingles";
import { JingleForm } from "@/components/admin/JingleForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function NewJinglePage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createJingle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jingles"] });
      router.push(`/admin_athos/${churchSlug}/vinhetas`);
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Nova Vinheta"
        backHref={`/admin_athos/${churchSlug}/vinhetas`}
        backLabel="Vinhetas"
      />
      <JingleForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
