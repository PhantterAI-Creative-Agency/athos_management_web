"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEvent, updateEvent } from "@/api-client/events";
import { EventForm } from "@/components/admin/EventForm";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ churchSlug: string; id: string }>;
}) {
  const { churchSlug, id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["events", id],
    queryFn: () => getEvent(id),
  });

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof updateEvent>[1]) => updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push(`/admin_athos/${churchSlug}/eventos`);
    },
  });

  if (isLoading || !event) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-5 text-2xl font-semibold">Editar Evento</h2>
      <EventForm
        initialEvent={event}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
