"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDevotional, listDevotionals } from "@/api-client/devotionals";

export default function AdminDevotionalsPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: devotionals, isLoading } = useQuery({
    queryKey: ["devotionals"],
    queryFn: () => listDevotionals(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteDevotional(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["devotionals"] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Devocionais</h2>
        <Link
          href={`/admin_athos/${churchSlug}/devocionais/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Novo Devocional
        </Link>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {devotionals?.map((devotional) => (
          <div
            key={devotional.id}
            className="flex items-center justify-between rounded-2xl bg-surface p-4"
          >
            <div>
              <p className="text-sm font-semibold">{devotional.title}</p>
              <p className="text-xs text-text-muted">
                {new Date(devotional.publishedAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin_athos/${churchSlug}/devocionais/${devotional.id}`}
                className="text-sm font-medium text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${devotional.title}"?`)) remove.mutate(devotional.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {devotionals?.length === 0 && (
          <p className="text-sm text-text-muted">Nenhum devocional cadastrado.</p>
        )}
      </div>
    </div>
  );
}
