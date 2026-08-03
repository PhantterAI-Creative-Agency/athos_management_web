"use client";

import { use, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listUsers } from "@/api-client/users";
import {
  addPrayerCareRecipient,
  listPastoralCareRequests,
  listPrayerCareRecipients,
  updatePrayerCareRecipient,
} from "@/api-client/pastoralCare";

export default function AcompanhamentoPastoralPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  use(params);
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => listUsers(),
  });

  const { data: recipients, isLoading: isLoadingRecipients } = useQuery({
    queryKey: ["pastoral-care", "recipients"],
    queryFn: listPrayerCareRecipients,
  });

  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["pastoral-care", "requests"],
    queryFn: listPastoralCareRequests,
  });

  const addMutation = useMutation({
    mutationFn: (userId: string) => addPrayerCareRecipient(userId),
    onSuccess: () => {
      setSelectedUserId("");
      queryClient.invalidateQueries({ queryKey: ["pastoral-care", "recipients"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => updatePrayerCareRecipient(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pastoral-care", "recipients"] });
    },
  });

  function userName(userId: string): string {
    return users?.find((user) => user.id === userId)?.name ?? userId;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h2 className="mb-1 text-2xl font-semibold">Acompanhamento Pastoral</h2>
        <p className="mb-5 text-sm text-text-muted">
          Irmãos e líderes cadastrados aqui recebem os pedidos de oração e aconselhamento
          encaminhados pelo assistente de IA.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedUserId) addMutation.mutate(selectedUserId);
          }}
          className="mb-5 flex gap-2 rounded-2xl bg-surface p-4"
        >
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 rounded-xl bg-background p-3 text-sm outline-none"
          >
            <option value="">Selecione um usuário...</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedUserId || addMutation.isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Adicionar
          </button>
        </form>

        {isLoadingRecipients && <p className="text-sm text-text-muted">Carregando...</p>}

        <div className="flex flex-col gap-3">
          {recipients?.map((recipient) => (
            <div
              key={recipient.id}
              className="flex items-center justify-between rounded-2xl bg-surface p-4"
            >
              <p className="text-sm font-semibold">{userName(recipient.userId)}</p>
              <button
                type="button"
                onClick={() => toggleMutation.mutate({ id: recipient.id, active: !recipient.active })}
                className={`text-sm font-medium ${recipient.active ? "text-accent" : "text-text-muted"}`}
              >
                {recipient.active ? "Ativo" : "Inativo"}
              </button>
            </div>
          ))}
          {recipients?.length === 0 && (
            <p className="text-sm text-text-muted">Nenhum destinatário cadastrado.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Pedidos recebidos</h3>

        {isLoadingRequests && <p className="text-sm text-text-muted">Carregando...</p>}

        <div className="flex flex-col gap-3">
          {requests?.map((request) => (
            <div key={request.id} className="rounded-2xl bg-surface p-4">
              <p className="mb-1 text-xs text-text-muted">
                {request.userId ? userName(request.userId) : `${request.guestName} (${request.guestWhatsapp})`}
                {" · "}
                {new Date(request.createdAt).toLocaleString("pt-BR")}
              </p>
              <p className="text-sm">{request.message}</p>
            </div>
          ))}
          {requests?.length === 0 && (
            <p className="text-sm text-text-muted">Nenhum pedido recebido ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
