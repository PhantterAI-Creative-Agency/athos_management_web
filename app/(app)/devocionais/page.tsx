"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { AuthGuard } from "@/components/AuthGuard";
import { listDevotionals } from "@/api-client/devotionals";

function DevocionaisContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: devotionals } = useQuery({
    queryKey: ["devotionals"],
    queryFn: () => listDevotionals(),
  });

  const selected = selectedId
    ? devotionals?.find((d) => d.id === selectedId)
    : devotionals?.[0];

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Devocionais</h2>
      <p className="mb-5 text-sm text-text-muted">Alimente sua fé diariamente</p>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-2 md:w-64 md:flex-none">
          {devotionals?.map((dev) => (
            <button
              key={dev.id}
              type="button"
              onClick={() => setSelectedId(dev.id)}
              className={`rounded-xl p-3 text-left text-sm transition-colors ${
                selectedId === dev.id || (!selectedId && dev === devotionals?.[0])
                  ? "bg-accent-tint text-accent-tint-text"
                  : "bg-surface hover:bg-accent-tint/50"
              }`}
            >
              <p className="font-semibold">{dev.title}</p>
              <p className="text-[10px]">
                {new Date(dev.publishedAt).toLocaleDateString("pt-BR")}
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="flex-1">
            <CoverImage
              label={selected.title}
              seed={`dev-${selected.id}`}
              className="mb-4 h-[180px] md:h-[250px]"
            />
            <h3 className="mb-2 text-xl font-semibold">{selected.title}</h3>
            <p className="mb-4 text-xs text-text-muted">
              {new Date(selected.publishedAt).toLocaleDateString("pt-BR")}
            </p>
            <div className="prose prose-sm max-w-none leading-relaxed">
              {selected.content.split("\n").map((p, i) => (
                <p key={i} className="mb-3">{p}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DevocionaisPage() {
  return (
    <AuthGuard>
      <AppShell active="/devocionais">
        <DevocionaisContent />
      </AppShell>
    </AuthGuard>
  );
}
