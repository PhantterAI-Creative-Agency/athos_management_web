"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAd } from "@/api-client/ads";
import { AdForm } from "@/components/admin/AdForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function NewAdPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      router.push(`/admin_athos/${churchSlug}/anuncios`);
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Novo Anúncio"
        backHref={`/admin_athos/${churchSlug}/anuncios`}
        backLabel="Anúncios"
      />
      <AdForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
