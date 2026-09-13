"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAd } from "@/api-client/ads";
import { AdForm } from "@/components/admin/AdForm";

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
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Novo Anúncio</h2>
      <AdForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
