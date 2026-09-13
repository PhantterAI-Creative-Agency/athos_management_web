"use client";

import { useState } from "react";
import type { AdDTO, AdFormat, AdInputDTO } from "@/api-client/ads";
import { BannerUpload } from "@/components/ui/BannerUpload";

const SLIDE_WIDTH = 1200;
const SLIDE_HEIGHT = 450;
const CARD_WIDTH = 600;
const CARD_HEIGHT = 600;

const PLACEMENT_OPTIONS: { value: string; label: string; format: AdFormat }[] = [
  { value: "home_hero", label: "Home — Banner principal (slide)", format: "slide" },
  { value: "home_grid", label: "Home — Grade (card)", format: "card" },
];

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function AdForm({
  initialAd,
  onSubmit,
  isSubmitting,
}: {
  initialAd?: AdDTO;
  onSubmit: (data: AdInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [placement, setPlacement] = useState(initialAd?.placement ?? PLACEMENT_OPTIONS[0].value);
  const [title, setTitle] = useState(initialAd?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initialAd?.imageUrl ?? "");
  const [linkUrl, setLinkUrl] = useState(initialAd?.linkUrl ?? "");
  const [active, setActive] = useState(initialAd?.active ?? true);
  const [startDate, setStartDate] = useState(toDateInputValue(initialAd?.startDate));
  const [endDate, setEndDate] = useState(toDateInputValue(initialAd?.endDate));
  const [order, setOrder] = useState(initialAd?.order?.toString() ?? "0");
  const [error, setError] = useState<string | null>(null);

  const selectedPlacement = PLACEMENT_OPTIONS.find((option) => option.value === placement) ?? PLACEMENT_OPTIONS[0];
  const format = selectedPlacement.format;
  const targetWidth = format === "slide" ? SLIDE_WIDTH : CARD_WIDTH;
  const targetHeight = format === "slide" ? SLIDE_HEIGHT : CARD_HEIGHT;

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();

        if (!imageUrl) {
          setError("Envie a imagem do anúncio.");
          return;
        }

        setError(null);
        onSubmit({
          format,
          placement,
          title,
          imageUrl,
          linkUrl: linkUrl || undefined,
          active,
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          order: order ? Number(order) : undefined,
        });
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Posição</span>
        <select
          value={placement}
          onChange={(e) => {
            setPlacement(e.target.value);
            setImageUrl("");
          }}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        >
          {PLACEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Título / Anunciante</span>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <BannerUpload
        label="Imagem do anúncio"
        imageUrl={imageUrl}
        targetWidth={targetWidth}
        targetHeight={targetHeight}
        onUpload={setImageUrl}
      />

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Link de destino (opcional)</span>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://"
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Início da exibição (opcional)</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Fim da exibição (opcional)</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Ordem (menor aparece primeiro em empates)</span>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Ativo
      </label>

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
