"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJingle } from "@/api-client/jingles";
import { JingleForm } from "@/components/admin/JingleForm";

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
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Nova Vinheta</h2>
      <JingleForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
