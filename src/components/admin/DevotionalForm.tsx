"use client";

import { useState } from "react";
import type { DevotionalDTO, DevotionalInputDTO } from "@/api-client/devotionals";
import { BannerUpload } from "@/components/ui/BannerUpload";
import { FormSection } from "@/components/admin/form-layout/FormSection";
import { FormSidebarCard } from "@/components/admin/form-layout/FormSidebarCard";

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <FormSection title="Conteúdo">
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
              <span className="mb-1 block text-sm font-medium">Conteúdo</span>
              <textarea
                required
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
              />
            </label>
          </FormSection>

          <FormSection title="Foto">
            <BannerUpload
              label="Foto do devocional"
              imageUrl={imageUrl}
              targetWidth={BANNER_WIDTH}
              targetHeight={BANNER_HEIGHT}
              onUpload={setImageUrl}
            />
          </FormSection>
        </div>

        <div className="flex flex-col gap-6">
          <FormSidebarCard title="Publicação">
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
          </FormSidebarCard>
        </div>
      </div>

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
