"use client";

import { useState } from "react";
import type { EventDTO, EventInputDTO } from "@/api-client/events";
import { BannerUpload } from "@/components/ui/BannerUpload";

const BANNER_WIDTH = 800;
const BANNER_HEIGHT = 450;
const FEATURED_BANNER_WIDTH = 1200;
const FEATURED_BANNER_HEIGHT = 630;

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function EventForm({
  initialEvent,
  onSubmit,
  isSubmitting,
}: {
  initialEvent?: EventDTO;
  onSubmit: (data: EventInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initialEvent?.imageUrl ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    initialEvent?.featuredImageUrl ?? "",
  );
  const [date, setDate] = useState(toDateInputValue(initialEvent?.date));
  const [location, setLocation] = useState(initialEvent?.location ?? "");
  const [price, setPrice] = useState(initialEvent?.price?.toString() ?? "");
  const [featured, setFeatured] = useState(initialEvent?.featured ?? false);
  const [showHighlightUpload, setShowHighlightUpload] = useState(
    !!initialEvent?.featuredImageUrl,
  );
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();

        if (!imageUrl) {
          setError("Envie o banner do evento.");
          return;
        }
        if (showHighlightUpload && !featuredImageUrl) {
          setError("Envie o banner de destaque.");
          return;
        }

        setError(null);
        onSubmit({
          title,
          imageUrl,
          featuredImageUrl: showHighlightUpload ? featuredImageUrl : undefined,
          date: new Date(date).toISOString(),
          location: location || undefined,
          price: price ? Number(price) : undefined,
          featured,
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
        label="Banner do evento"
        imageUrl={imageUrl}
        targetWidth={BANNER_WIDTH}
        targetHeight={BANNER_HEIGHT}
        onUpload={setImageUrl}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Data</span>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Local</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Preço (opcional)</span>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Exibir na seção &quot;Conferências e Eventos&quot; da Home
      </label>

      {!showHighlightUpload ? (
        <button
          type="button"
          onClick={() => setShowHighlightUpload(true)}
          className="label-caps self-start rounded-full border border-divider px-4 py-2 text-xs transition-colors hover:bg-background"
        >
          Adicionar ao Destaque da Home
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <BannerUpload
            label="Banner de destaque"
            imageUrl={featuredImageUrl}
            targetWidth={FEATURED_BANNER_WIDTH}
            targetHeight={FEATURED_BANNER_HEIGHT}
            onUpload={setFeaturedImageUrl}
          />
          <button
            type="button"
            onClick={() => {
              setShowHighlightUpload(false);
              setFeaturedImageUrl("");
            }}
            className="label-caps self-start text-xs text-text-muted hover:text-foreground"
          >
            Remover destaque da Home
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

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
