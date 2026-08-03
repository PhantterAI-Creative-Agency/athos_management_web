"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEvent, listEvents, updateEvent } from "@/api-client/events";

export default function AdminEventsPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => listEvents(),
  });

  const toggleFeatured = useMutation({
    mutationFn: (vars: { id: string; featured: boolean }) =>
      updateEvent(vars.id, { featured: vars.featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Eventos</h2>
        <Link
          href={`/admin_athos/${churchSlug}/eventos/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Novo Evento
        </Link>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {events?.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-2xl bg-surface p-4"
          >
            <div>
              <p className="text-sm font-semibold">{event.title}</p>
              <p className="text-xs text-text-muted">
                {new Date(event.date).toLocaleDateString("pt-BR")}
                {event.location && ` · ${event.location}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={event.featured}
                  onChange={(e) =>
                    toggleFeatured.mutate({ id: event.id, featured: e.target.checked })
                  }
                />
                Em destaque
              </label>
              <Link
                href={`/admin_athos/${churchSlug}/eventos/${event.id}`}
                className="text-sm font-medium text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${event.title}"?`)) remove.mutate(event.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {events?.length === 0 && (
          <p className="text-sm text-text-muted">Nenhum evento cadastrado.</p>
        )}
      </div>
    </div>
  );
}
