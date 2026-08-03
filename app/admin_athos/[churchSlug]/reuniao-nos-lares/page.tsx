"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteGrowthGroup, listGrowthGroups } from "@/api-client/growthGroups";
import { getMyChurch, updateMyChurch } from "@/api-client/churches";

function NamingSettingsForm() {
  const queryClient = useQueryClient();
  const { data: church, isLoading } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
  });

  const [form, setForm] = useState<{ name: string; acronym: string } | null>(null);
  const editing =
    form ??
    (church
      ? { name: church.settings.growthGroupName, acronym: church.settings.growthGroupAcronym }
      : null);

  const mutation = useMutation({
    mutationFn: (data: { growthGroupName: string; growthGroupAcronym: string }) =>
      updateMyChurch({ settings: data }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["churches", "me"], updated);
      setForm(null);
    },
  });

  if (isLoading || !editing) {
    return <p className="text-sm text-text-muted">Carregando...</p>;
  }

  return (
    <form
      className="mb-6 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          growthGroupName: editing.name,
          growthGroupAcronym: editing.acronym,
        });
      }}
    >
      <div className="mb-4 flex flex-col gap-4 md:flex-row">
        <label className="block flex-1">
          <span className="mb-1 block text-sm font-medium">Nome</span>
          <input
            type="text"
            value={editing.name}
            onChange={(e) => setForm({ ...editing, name: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block md:w-40">
          <span className="mb-1 block text-sm font-medium">Sigla</span>
          <input
            type="text"
            value={editing.acronym}
            onChange={(e) => setForm({ ...editing, acronym: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="label-caps rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {mutation.isPending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}

export default function AdminGrowthGroupsPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ["growthGroups"],
    queryFn: () => listGrowthGroups(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteGrowthGroup(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["growthGroups"] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 text-2xl font-semibold">Reunião nos Lares</h2>

      <NamingSettingsForm />

      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Grupos</h3>
        <Link
          href={`/admin_athos/${churchSlug}/reuniao-nos-lares/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Novo Grupo
        </Link>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {groups?.map((group) => (
          <div
            key={group.id}
            className="flex items-center justify-between rounded-2xl bg-surface p-4"
          >
            <div>
              <p className="text-sm font-semibold">{group.name}</p>
              <p className="text-xs text-text-muted">
                Líder: {group.leaderName} · {group.membersIds.length} membro(s)
                {group.hasPendencies && " · pendências"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin_athos/${churchSlug}/reuniao-nos-lares/${group.id}`}
                className="text-sm font-medium text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${group.name}"?`)) remove.mutate(group.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {groups?.length === 0 && (
          <p className="text-sm text-text-muted">Nenhum grupo cadastrado.</p>
        )}
      </div>
    </div>
  );
}
