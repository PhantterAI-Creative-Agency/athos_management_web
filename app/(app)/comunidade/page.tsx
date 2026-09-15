"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "@/components/ui/Tag";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { listFriends, sendFriendRequest, acceptFriendRequest, removeFriend } from "@/api-client/friends";
import { listFollows } from "@/api-client/follows";
import { listUsers, type UserDTO } from "@/api-client/users";

function ComunidadeContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"accepted" | "pending" | "following">("accepted");

  const { data: friends } = useQuery({
    queryKey: ["friends", tab],
    queryFn: () => listFriends(tab === "following" ? undefined : tab),
    enabled: tab !== "following",
  });

  const { data: following } = useQuery({
    queryKey: ["follows", "following"],
    queryFn: () => listFollows("following"),
    enabled: tab === "following",
  });

  const { data: users } = useQuery({
    queryKey: ["users", "church"],
    queryFn: () => listUsers(),
    enabled: !!user?.churchId,
  });

  const usersById = useMemo(() => {
    const map = new Map<string, UserDTO>();
    for (const u of users ?? []) map.set(u.id, u);
    return map;
  }, [users]);

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFriend(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friends"] }),
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => acceptFriendRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["friends"] }),
  });

  const pendingReceived = friends?.filter((f) => f.status === "pending" && f.friendId === user?.id) || [];
  const pendingSent = friends?.filter((f) => f.status === "pending" && f.userId === user?.id) || [];
  const accepted = friends?.filter((f) => f.status === "accepted") || [];
  const followingList = (following || [])
    .map((f) => usersById.get(f.followingId))
    .filter((u): u is UserDTO => !!u);

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
        <button
          type="button"
          onClick={() => setTab("following")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === "following" ? "bg-accent text-white" : "bg-surface"}`}
        >
          Seguindo
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
                {pendingReceived.map((f) => {
                  const other = usersById.get(f.userId);
                  return (
                    <div key={f.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
                      <div className="flex items-center gap-3">
                        <CoverImage label={other?.name ?? "Membro"} seed={`friend-${f.userId}`} className="h-10 w-10 rounded-full" />
                        <p className="text-sm font-medium">{other?.name ?? "Membro"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => acceptMutation.mutate(f.id)}
                        disabled={acceptMutation.isPending && acceptMutation.variables === f.id}
                        className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white disabled:opacity-50"
                      >
                        Aceitar
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {pendingSent.length > 0 && (
            <>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Enviados
              </h3>
              <div className="flex flex-col gap-2">
                {pendingSent.map((f) => {
                  const other = usersById.get(f.friendId);
                  return (
                    <div key={f.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
                      <div className="flex items-center gap-3">
                        <CoverImage label={other?.name ?? "Membro"} seed={`friend-${f.friendId}`} className="h-10 w-10 rounded-full" />
                        <p className="text-sm font-medium">{other?.name ?? "Membro"}</p>
                      </div>
                      <Tag>Aguardando</Tag>
                    </div>
                  );
                })}
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
                const other = usersById.get(otherId);
                return (
                  <div key={f.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
                    <div className="flex items-center gap-3">
                      <CoverImage label={other?.name ?? "Amigo"} seed={`friend-${otherId}`} className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{other?.name ?? "Membro"}</p>
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

      {tab === "following" && (
        <>
          {followingList.length > 0 ? (
            <div className="flex flex-col gap-2">
              {followingList.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl bg-surface p-3">
                  <CoverImage label={u.name} seed={`user-${u.id}`} className="h-10 w-10 rounded-full" />
                  <p className="text-sm font-medium">{u.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-text-muted">
              Você ainda não está seguindo ninguém
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function ComunidadePage() {
  return (
    <AuthGuard>
      <AppShell active="/comunidade">
        <ComunidadeContent />
      </AppShell>
    </AuthGuard>
  );
}
