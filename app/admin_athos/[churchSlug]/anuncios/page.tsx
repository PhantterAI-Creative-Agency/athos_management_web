"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAd, listAds, updateAd } from "@/api-client/ads";

const PLACEMENT_LABELS: Record<string, string> = {
  home_hero: "Home — Banner principal",
  home_grid: "Home — Grade",
};

export default function AdminAdsPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: () => listAds(),
  });

  const toggleActive = useMutation({
    mutationFn: (vars: { id: string; active: boolean }) => updateAd(vars.id, { active: vars.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ads"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAd(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ads"] }),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Anúncios</h2>
        <Link
          href={`/admin_athos/${churchSlug}/anuncios/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Novo Anúncio
        </Link>
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {ads?.map((ad) => (
          <div key={ad.id} className="flex items-center justify-between rounded-2xl bg-surface p-4">
            <div>
              <p className="text-sm font-semibold">{ad.title}</p>
              <p className="text-xs text-text-muted">
                {PLACEMENT_LABELS[ad.placement] ?? ad.placement} · {ad.impressions} impressões · {ad.clicks} cliques
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={ad.active}
                  onChange={(e) => toggleActive.mutate({ id: ad.id, active: e.target.checked })}
                />
                Ativo
              </label>
              <Link href={`/admin_athos/${churchSlug}/anuncios/${ad.id}`} className="text-sm font-medium text-accent">
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${ad.title}"?`)) remove.mutate(ad.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {ads?.length === 0 && <p className="text-sm text-text-muted">Nenhum anúncio cadastrado.</p>}
      </div>
    </div>
  );
}
