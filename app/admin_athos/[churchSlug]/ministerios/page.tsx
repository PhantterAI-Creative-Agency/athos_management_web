"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMinistry, listMinistries } from "@/api-client/ministries";

export default function AdminMinistriesPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: ministries, isLoading } = useQuery({
    queryKey: ["ministries"],
    queryFn: () => listMinistries(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteMinistry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ministries"] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ministérios</h2>
        <Link
          href={`/admin_athos/${churchSlug}/ministerios/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Novo Ministério
        </Link>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {ministries?.map((ministry) => (
          <div
            key={ministry.id}
            className="flex items-center justify-between rounded-2xl bg-surface p-4"
          >
            <div>
              <p className="text-sm font-semibold">{ministry.name}</p>
              <p className="text-xs text-text-muted">
                {ministry.participantsCount} voluntário(s)
                {ministry.contractRequired && " · exige termo"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin_athos/${churchSlug}/ministerios/${ministry.id}/escalas`}
                className="text-sm font-medium text-accent"
              >
                Escalas
              </Link>
              <Link
                href={`/admin_athos/${churchSlug}/ministerios/${ministry.id}`}
                className="text-sm font-medium text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${ministry.name}"?`)) remove.mutate(ministry.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {ministries?.length === 0 && (
          <p className="text-sm text-text-muted">Nenhum ministério cadastrado.</p>
        )}
      </div>
    </div>
  );
}
