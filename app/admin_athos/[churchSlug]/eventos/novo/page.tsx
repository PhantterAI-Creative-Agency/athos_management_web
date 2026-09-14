"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/api-client/events";
import { EventForm } from "@/components/admin/EventForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function NewEventPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push(`/admin_athos/${churchSlug}/eventos`);
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Novo Evento"
        backHref={`/admin_athos/${churchSlug}/eventos`}
        backLabel="Eventos"
      />
      <EventForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}
