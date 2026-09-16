"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listUsers, updateUser } from "@/api-client/users";

type StatusFilter = "all" | "active" | "pending";

export default function AdminUsersPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => listUsers(),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => updateUser(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (users ?? [])
      .filter((u) => (status === "active" ? u.active : status === "pending" ? !u.active : true))
      .filter(
        (u) =>
          !term || u.name.toLowerCase().includes(term) || (u.email ?? "").toLowerCase().includes(term),
      );
  }, [users, status, search]);

  const pendingCount = users?.filter((u) => !u.active).length ?? 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Usuários</h2>
        <Link
          href={`/admin_athos/${churchSlug}/usuarios/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Novo Usuário
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(
            [
              { key: "all", label: "Todos" },
              { key: "active", label: "Ativos" },
              { key: "pending", label: `Pendentes${pendingCount ? ` (${pendingCount})` : ""}` },
            ] as { key: StatusFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={`label-caps rounded-full px-4 py-1.5 text-xs ${
                status === key ? "bg-accent text-background" : "bg-surface text-text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Buscar por nome ou e-mail"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm sm:w-64"
        />
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-2xl bg-surface p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{user.name}</p>
                <span
                  className={`label-caps rounded-full px-2 py-0.5 text-[0.6rem] ${
                    user.active ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {user.active ? "Ativo" : "Pendente"}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                {user.email ?? "sem e-mail"}
                {user.roles.length > 0 && ` · ${user.roles.join(", ")}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                disabled={toggleActive.isPending}
                onClick={() => toggleActive.mutate({ id: user.id, active: !user.active })}
                className={`text-sm font-medium disabled:opacity-50 ${
                  user.active ? "text-red-600" : "text-accent"
                }`}
              >
                {user.active ? "Desativar" : "Ativar"}
              </button>
            </div>
          </div>
        ))}

        {!isLoading && filteredUsers.length === 0 && (
          <p className="text-sm text-text-muted">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
