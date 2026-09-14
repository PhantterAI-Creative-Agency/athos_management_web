"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMedia } from "@/api-client/media";
import { MediaForm } from "@/components/admin/MediaForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function NewMediaPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      router.push(`/admin_athos/${churchSlug}/midias`);
    },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <FormPageHeader
        title="Nova Mídia"
        backHref={`/admin_athos/${churchSlug}/midias`}
        backLabel="Mídias"
      />
      <MediaForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
