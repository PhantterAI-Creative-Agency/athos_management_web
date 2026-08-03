"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteMedia, listMedia } from "@/api-client/media";

export default function AdminMediaPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: mediaList, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => listMedia(),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media"] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Mídias</h2>
        <Link
          href={`/admin_athos/${churchSlug}/midias/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Nova Mídia
        </Link>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {mediaList?.map((media) => (
          <div
            key={media.id}
            className="flex items-center justify-between rounded-2xl bg-surface p-4"
          >
            <div>
              <p className="text-sm font-semibold">{media.title}</p>
              <p className="text-xs text-text-muted">
                {media.type === "video" ? "Vídeo" : "Foto"} · {media.category}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/admin_athos/${churchSlug}/midias/${media.id}`}
                className="text-sm font-medium text-accent"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${media.title}"?`)) remove.mutate(media.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {mediaList?.length === 0 && (
          <p className="text-sm text-text-muted">Nenhuma mídia cadastrada.</p>
        )}
      </div>
    </div>
  );
}
