"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAd, updateAd } from "@/api-client/ads";
import { AdForm } from "@/components/admin/AdForm";

export default function EditAdPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: ad, isLoading } = useQuery({
    queryKey: ["ads", id],
    queryFn: () => getAd(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateAd>[1]) => updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      router.push(`/admin_athos/${churchSlug}/anuncios`);
    },
  });

  if (isLoading || !ad) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Editar Anúncio</h2>
      <AdForm initialAd={ad} onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
