"use client";

import { useState } from "react";
import type { JingleDTO, JingleInputDTO } from "@/api-client/jingles";
import { FormSection } from "@/components/admin/form-layout/FormSection";
import { FormSidebarCard } from "@/components/admin/form-layout/FormSidebarCard";

export function JingleForm({
  initialJingle,
  onSubmit,
  isSubmitting,
}: {
  initialJingle?: JingleDTO;
  onSubmit: (data: JingleInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState(initialJingle?.title ?? "");
  const [url, setUrl] = useState(initialJingle?.url ?? "");
  const [active, setActive] = useState(initialJingle?.active ?? true);
  const [order, setOrder] = useState(initialJingle?.order?.toString() ?? "0");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          url,
          active,
          order: order ? Number(order) : undefined,
        });
      }}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <FormSection
            title="Vinheta"
            description="Cole a URL de um arquivo de áudio (MP3) já hospedado. As vinhetas ativas tocam em sequência no player do site."
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

            <label className="block">
              <span className="mb-1 block text-sm font-medium">URL do áudio</span>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
                className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
              />
            </label>
          </FormSection>
        </div>

        <div className="flex flex-col gap-6">
          <FormSidebarCard title="Reprodução">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              Ativa
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Ordem de reprodução</span>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
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
