"use client";

import { useState } from "react";
import type { MediaDTO, MediaInputDTO } from "@/api-client/media";
import { FormSection } from "@/components/admin/form-layout/FormSection";

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
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ type: "photo", category, title, url: url || undefined });
      }}
    >
      <FormSection
        title="Informações da mídia"
        description="Vídeos são sincronizados automaticamente do canal do YouTube da igreja. Este formulário cadastra apenas fotos."
      >
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
      </FormSection>

      <button
        type="submit"
        disabled={isSubmitting}
        className="label-caps mt-6 rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
