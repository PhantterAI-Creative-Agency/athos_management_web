"use client";

import { useState } from "react";
import type { DevotionalDTO, DevotionalInputDTO } from "@/api-client/devotionals";
import { BannerUpload } from "@/components/ui/BannerUpload";

const BANNER_WIDTH = 800;
const BANNER_HEIGHT = 800;

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function DevotionalForm({
  initialDevotional,
  onSubmit,
  isSubmitting,
}: {
  initialDevotional?: DevotionalDTO;
  onSubmit: (data: DevotionalInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState(initialDevotional?.title ?? "");
  const [content, setContent] = useState(initialDevotional?.content ?? "");
  const [imageUrl, setImageUrl] = useState(initialDevotional?.imageUrl ?? "");
  const [publishedAt, setPublishedAt] = useState(
    toDateInputValue(initialDevotional?.publishedAt) || toDateInputValue(new Date().toISOString()),
  );

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          content,
          publishedAt: new Date(publishedAt).toISOString(),
          imageUrl: imageUrl || undefined,
        });
      }}
    >
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

      <BannerUpload
        label="Foto do devocional"
        imageUrl={imageUrl}
        targetWidth={BANNER_WIDTH}
        targetHeight={BANNER_HEIGHT}
        onUpload={setImageUrl}
      />

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Data de publicação</span>
        <input
          type="date"
          required
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Conteúdo</span>
        <textarea
          required
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
