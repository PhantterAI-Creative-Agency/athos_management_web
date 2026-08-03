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
  const [type, setType] = useState<"video" | "photo">(initialMedia?.type ?? "photo");
  const [category, setCategory] = useState(initialMedia?.category ?? "");
  const [title, setTitle] = useState(initialMedia?.title ?? "");
  const [youtubeId, setYoutubeId] = useState(initialMedia?.youtubeId ?? "");
  const [url, setUrl] = useState(initialMedia?.url ?? "");

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          type,
          category,
          title,
          youtubeId: type === "video" ? youtubeId || undefined : undefined,
          url: type === "photo" ? url || undefined : undefined,
        });
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Tipo</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "video" | "photo")}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        >
          <option value="photo">Foto</option>
          <option value="video">Vídeo (YouTube)</option>
        </select>
      </label>

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

      {type === "video" ? (
        <label className="block">
          <span className="mb-1 block text-sm font-medium">ID do vídeo no YouTube</span>
          <input
            type="text"
            required
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>
      ) : (
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
      )}

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
