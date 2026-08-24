"use client";

import { useState } from "react";
import type { MediaDTO, MediaInputDTO } from "@/api-client/media";

export function MediaForm({
  initialMedia,
  onSubmit,
  isSubmitting,
}: {
  initialMedia?: MediaDTO;
  onSubmit: (data: MediaInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [category, setCategory] = useState(initialMedia?.category ?? "");
  const [title, setTitle] = useState(initialMedia?.title ?? "");
  const [url, setUrl] = useState(initialMedia?.url ?? "");

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ type: "photo", category, title, url: url || undefined });
      }}
    >
      <p className="text-sm text-foreground/70">
        Vídeos são sincronizados automaticamente do canal do YouTube da igreja. Este formulário cadastra apenas fotos.
      </p>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Categoria</span>
        <input
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Título</span>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">URL da imagem</span>
        <input
          type="text"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="label-caps mt-2 rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
