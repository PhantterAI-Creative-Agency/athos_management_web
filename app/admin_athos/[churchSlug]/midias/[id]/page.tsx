"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMedia, updateMedia } from "@/api-client/media";
import { MediaForm } from "@/components/admin/MediaForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function EditMediaPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: media, isLoading } = useQuery({
    queryKey: ["media", id],
    queryFn: () => getMedia(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateMedia>[1]) => updateMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      router.push(`/admin_athos/${churchSlug}/midias`);
    },
  });

  if (isLoading || !media) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <FormPageHeader
        title="Editar Mídia"
        backHref={`/admin_athos/${churchSlug}/midias`}
        backLabel="Mídias"
      />
      <MediaForm
        initialMedia={media}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
