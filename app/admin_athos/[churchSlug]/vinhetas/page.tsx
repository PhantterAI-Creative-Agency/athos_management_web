"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteJingle, listJingles } from "@/api-client/jingles";

export default function AdminJinglesPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: jingles, isLoading } = useQuery({
    queryKey: ["jingles"],
    queryFn: () => listJingles(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteJingle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jingles"] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Vinhetas</h2>
        <Link
          href={`/admin_athos/${churchSlug}/vinhetas/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Nova Vinheta
        </Link>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {jingles?.map((jingle) => (
          <div
            key={jingle.id}
            className="flex items-center justify-between rounded-2xl bg-surface p-4"
          >
            <div>
              <p className="text-sm font-semibold">{jingle.title}</p>
              <p className="text-xs text-text-muted">
                Ordem {jingle.order} · {jingle.active ? "Ativa" : "Inativa"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin_athos/${churchSlug}/vinhetas/${jingle.id}`}
                className="text-sm font-medium text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${jingle.title}"?`)) remove.mutate(jingle.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {jingles?.length === 0 && (
          <p className="text-sm text-text-muted">Nenhuma vinheta cadastrada.</p>
        )}
      </div>
    </div>
  );
}
