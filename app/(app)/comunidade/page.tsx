"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "@/components/ui/Tag";
import { useAuth } from "@/hooks/useAuth";
import { listFriends, sendFriendRequest, acceptFriendRequest, removeFriend } from "@/api-client/friends";

function ComunidadeContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"accepted" | "pending">("accepted");

  const { data: friends } = useQuery({
    queryKey: ["friends", tab],
    queryFn: () => listFriends(tab),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFriend(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friends"] }),
  });

  const friendsAsUser = friends?.filter((f) => f.friendId !== user?.id) || [];
  const friendsAsFriend = friends?.filter((f) => f.friendId === user?.id) || [];
  const pendingSent = friendsAsFriend.filter((f) => f.status === "pending");
  const pendingReceived = friendsAsUser.filter((f) => f.status === "pending");
  const accepted = friends?.filter((f) => f.status === "accepted") || [];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Comunidade</h2>
      <p className="mb-5 text-sm text-text-muted">Conecte-se com irmãos da igreja</p>

      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("accepted")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === "accepted" ? "bg-accent text-white" : "bg-surface"}`}
        >
          Amigos
        </button>
        <button
          type="button"
          onClick={() => setTab("pending")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === "pending" ? "bg-accent text-white" : "bg-surface"}`}
        >
          Convites
        </button>
      </div>

      {tab === "pending" && (
        <>
          {pendingReceived.length > 0 && (
            <>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
                Recebidos
              </h3>
              <div className="mb-6 flex flex-col gap-2">
                {pendingReceived.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <div className="flex items-center gap-3">
                      <CoverImage label="Usuário" seed={`friend-${f.userId}`} className="h-10 w-10 rounded-full" />
                      <p className="text-sm font-medium">Membro</p>
                    </div>
                    <Tag>Pendente</Tag>
                  </div>
                ))}
              </div>
            </>
          )}

          {pendingSent.length > 0 && (
            <>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Enviados
              </h3>
              <div className="flex flex-col gap-2">
                {pendingSent.map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <div className="flex items-center gap-3">
                      <CoverImage label="Usuário" seed={`friend-${f.friendId}`} className="h-10 w-10 rounded-full" />
                      <p className="text-sm font-medium">Membro</p>
                    </div>
                    <Tag>Aguardando</Tag>
                  </div>
                ))}
              </div>
            </>
          )}

          {pendingReceived.length === 0 && pendingSent.length === 0 && (
            <p className="text-center text-sm text-text-muted">Nenhum convite pendente</p>
          )}
        </>
      )}

      {tab === "accepted" && (
        <>
          {accepted.length > 0 ? (
            <div className="flex flex-col gap-2">
              {accepted.map((f) => {
                const otherId = f.userId === user?.id ? f.friendId : f.userId;
                return (
                  <div key={f.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <div className="flex items-center gap-3">
                      <CoverImage label="Amigo" seed={`friend-${otherId}`} className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">Membro</p>
                        {f.mutualFriendsCount > 0 && (
                          <p className="text-[10px] text-text-muted">{f.mutualFriendsCount} amigos em comum</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(f.id)}
                      className="text-xs text-text-muted"
                    >
                      Remover
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-text-muted">
              Nenhum amigo ainda. Conecte-se com outros membros!
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function ComunidadePage() {
  return (
    <AppShell active="/comunidade">
      <ComunidadeContent />
    </AppShell>
  );
}
