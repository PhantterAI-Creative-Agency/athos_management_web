"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyChurch, updateMyChurch, type ChurchContactDTO, type ChurchHomeContentDTO } from "@/api-client/churches";
import { listEvents } from "@/api-client/events";

export default function AdminHomeContentPage() {
  const queryClient = useQueryClient();

  const { data: church, isLoading } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
  });

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: () => listEvents(),
  });

  const [homeContent, setHomeContent] = useState<ChurchHomeContentDTO | null>(null);
  const [contact, setContact] = useState<ChurchContactDTO | null>(null);

  const currentHomeContent = homeContent ?? church?.homeContent ?? {};
  const currentContact = contact ?? church?.contact ?? {};

  const mutation = useMutation({
    mutationFn: () => updateMyChurch({ homeContent: currentHomeContent, contact: currentContact }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["churches", "me"], updated);
      setHomeContent(null);
      setContact(null);
    },
  });

  if (isLoading) return <p className="text-sm text-text-muted">Carregando...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-1 text-2xl font-semibold">Conteúdo da Home</h2>
      <p className="mb-6 text-sm text-text-muted">
        Missão/Visão/Valores, evento em destaque (banner) e contato — Header e Hero não são editáveis.
      </p>

      <form
        className="flex flex-col gap-5 rounded-2xl bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Introdução</span>
          <textarea
            rows={3}
            value={currentHomeContent.intro ?? ""}
            onChange={(e) => setHomeContent({ ...currentHomeContent, intro: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Missão</span>
          <textarea
            rows={2}
            value={currentHomeContent.mission ?? ""}
            onChange={(e) => setHomeContent({ ...currentHomeContent, mission: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Visão</span>
          <textarea
            rows={2}
            value={currentHomeContent.vision ?? ""}
            onChange={(e) => setHomeContent({ ...currentHomeContent, vision: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Valores</span>
          <textarea
            rows={2}
            value={currentHomeContent.values ?? ""}
            onChange={(e) => setHomeContent({ ...currentHomeContent, values: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Evento em destaque (banner)</span>
          <select
            value={currentHomeContent.bannerEventId ?? ""}
            onChange={(e) =>
              setHomeContent({ ...currentHomeContent, bannerEventId: e.target.value || undefined })
            }
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          >
            <option value="">Automático (evento mais próximo)</option>
            {events?.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>

        <div className="border-t border-divider pt-4">
          <p className="mb-3 text-sm font-medium">Fale Conosco</p>
          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium">E-mail</span>
            <input
              type="email"
              value={currentContact.email ?? ""}
              onChange={(e) => setContact({ ...currentContact, email: e.target.value })}
              className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">WhatsApp</span>
            <input
              type="text"
              value={currentContact.whatsapp ?? ""}
              onChange={(e) => setContact({ ...currentContact, whatsapp: e.target.value })}
              className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
            />
          </label>
          <p className="mt-2 text-xs text-text-muted">
            O endereço exibido em &quot;Visite-nos&quot; é o mesmo cadastrado na aba Geral.
          </p>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="label-caps rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
