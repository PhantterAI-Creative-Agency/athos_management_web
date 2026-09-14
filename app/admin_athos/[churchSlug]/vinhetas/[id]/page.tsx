"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJingle, updateJingle } from "@/api-client/jingles";
import { JingleForm } from "@/components/admin/JingleForm";

export default function EditJinglePage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jingle, isLoading } = useQuery({
    queryKey: ["jingles", id],
    queryFn: () => getJingle(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateJingle>[1]) => updateJingle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jingles"] });
      router.push(`/admin_athos/${churchSlug}/vinhetas`);
    },
  });

  if (isLoading || !jingle) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Editar Vinheta</h2>
      <JingleForm
        initialJingle={jingle}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
