"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevotional } from "@/api-client/devotionals";
import { DevotionalForm } from "@/components/admin/DevotionalForm";

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
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Novo Devocional</h2>
      <DevotionalForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
